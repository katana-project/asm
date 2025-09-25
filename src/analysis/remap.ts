import type { Node } from "../";
import type { ClassEntry, NameTypeEntry, RefEntry, StringEntry, UTF8Entry } from "../pool";
import { ConstantType } from "../spec";
import { type Type, objectType, parseType, tryParseType } from "../type";

export interface Remapper {
    type(type: Type): Type;
    ref(owner: Type, name: string, type: Type): string;
}

// modified in-place
export const remap = ({ thisClass, fields, methods, pool }: Node, remapper: Remapper) => {
    const stringRefs = new Map<number, StringEntry[]>();

    // first pass: scan UTF8 constants referenced by string constants
    for (const entry of pool) {
        if (entry?.type !== ConstantType.STRING) {
            continue;
        }

        const stringEntry = entry as StringEntry;

        const utf8Entry = pool[stringEntry.data] as UTF8Entry;
        if (utf8Entry) {
            let refs = stringRefs.get(utf8Entry.index);
            if (!refs) {
                refs = [];
                stringRefs.set(utf8Entry.index, refs);
            }

            refs.push(stringEntry);
        }
    }

    // updates any string constants referencing this UTF8 constant
    const checkStringRef = (utf8Entry: UTF8Entry) => {
        const refs = stringRefs.get(utf8Entry.index);
        if (refs) {
            const clone: UTF8Entry = { ...utf8Entry, index: pool.length };
            pool.push(clone);

            for (const ref of refs) {
                ref.data = clone.index;
            }
        }
    };

    const thisType = objectType(`L${(pool[thisClass.name] as UTF8Entry).string};`);
    for (const member of [...fields, ...methods]) {
        const name = remapper.ref(thisType, member.name.string, parseType(member.type.string));
        if (name === member.name.string) {
            continue; // no change
        }

        const nameClone: UTF8Entry = { ...member.name, string: name, dirty: true, index: pool.length };
        pool.push(nameClone);
        member.name = nameClone;
    }

    const toScan = [...pool];

    // first pass: remap method/field names
    for (const entry of toScan) {
        switch (entry?.type) {
            case ConstantType.FIELDREF:
            case ConstantType.METHODREF:
            case ConstantType.INTERFACE_METHODREF: {
                const refEntry = entry as RefEntry;

                const ownerEntry = pool[refEntry.ref] as ClassEntry;
                const nameTypeEntry = pool[refEntry.nameType] as NameTypeEntry;
                if (!ownerEntry || !nameTypeEntry) {
                    continue;
                }

                const ownerNameEntry = pool[ownerEntry.name] as UTF8Entry;
                const nameEntry = pool[nameTypeEntry.name] as UTF8Entry;
                const typeEntry = pool[nameTypeEntry.type_] as UTF8Entry;
                if (!ownerNameEntry || !nameEntry || !typeEntry) {
                    continue;
                }

                const ownerType = objectType(`L${ownerNameEntry.string};`);
                const name = remapper.ref(ownerType, nameEntry.string, parseType(typeEntry.string));
                if (name === nameEntry.string) {
                    continue; // no change
                }

                const nameClone: UTF8Entry = { ...nameEntry, string: name, dirty: true, index: pool.length };
                pool.push(nameClone);
                const nameTypeClone: NameTypeEntry = { ...nameTypeEntry, name: nameClone.index, index: pool.length };
                pool.push(nameTypeClone);
                refEntry.nameType = nameTypeClone.index;
                break;
            }
        }
    }

    // second pass: remap class names and type descriptors
    for (const entry of toScan) {
        switch (entry?.type) {
            case ConstantType.UTF8: {
                const utf8Entry = entry as UTF8Entry;
                if (utf8Entry.dirty) {
                    continue; // already remapped
                }

                const type = tryParseType(utf8Entry.string);
                if (!type) {
                    continue; // not a type descriptor, skip
                }

                const remappedType = remapper.type(type);
                if (remappedType.value === type.value) {
                    continue; // no change
                }

                checkStringRef(utf8Entry);
                utf8Entry.string = remappedType.value;
                utf8Entry.dirty = true;
                break;
            }
            case ConstantType.CLASS: {
                const classEntry = entry as ClassEntry;

                const nameEntry = pool[classEntry.name] as UTF8Entry;
                if (!nameEntry || nameEntry.dirty) {
                    continue;
                }

                const remappedType = remapper.type(objectType(`L${nameEntry.string};`));
                if (remappedType.value === nameEntry.string) {
                    continue; // no change
                }

                checkStringRef(nameEntry);
                nameEntry.string = remappedType.value.slice(1, -1);
                nameEntry.dirty = true;
                break;
            }
        }
    }
};
