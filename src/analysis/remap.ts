import type { Pool, StringEntry, UTF8Entry } from "../pool";
import { ConstantType } from "../spec";
import { type Type, tryParseType } from "../type";

type Remapper = (type: Type) => Type;

// modified in-place
export const remap = (pool: Pool, remapFunc: Remapper) => {
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

    // second pass: scan all UTF8 constants for type descriptors
    for (const entry of [...pool]) {
        if (entry?.type !== ConstantType.UTF8) {
            continue;
        }

        const utf8Entry = entry as UTF8Entry;

        const type = tryParseType(utf8Entry.string);
        if (!type) {
            continue; // not a type descriptor, skip
        }

        const remappedType = remapFunc(type);
        if (remappedType.value === type.value) {
            continue; // no change
        }

        // update any string constants referencing this UTF8 constant
        const refs = stringRefs.get(utf8Entry.index);
        if (refs) {
            const clone: UTF8Entry = { ...utf8Entry, index: pool.length };
            pool.push(clone);

            for (const ref of refs) {
                ref.data = clone.index;
            }
        }

        utf8Entry.string = remappedType.value;
        utf8Entry.dirty = true;
    }
};
