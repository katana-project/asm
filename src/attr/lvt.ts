import { create, wrap } from "../buffer";
import type { Pool, UTF8Entry } from "../pool";
import { AttributeType } from "../spec";
import type { Attributable, Attribute } from "./";

export interface LocalVariableTableAttribute extends Attribute {
    type: AttributeType.LOCAL_VARIABLE_TABLE | AttributeType.LOCAL_VARIABLE_TYPE_TABLE;
    entries: LocalVariable[];
}

// descriptor = signature for LocalVariableTypeTable
export interface LocalVariable {
    startPC: number;
    length: number;

    nameIndex: number; // UTF8Entry index
    descriptorIndex: number; // UTF8Entry index
    index: number;

    nameEntry?: UTF8Entry;
    descriptorEntry?: UTF8Entry;
}

export const readLocalVariableTable = (attr: Attribute, pool: Pool): LocalVariableTableAttribute => {
    const buffer = wrap(attr.data);

    const length = buffer.getUint16();

    const entries = new Array<LocalVariable>(length);
    for (let i = 0; i < length; i++) {
        const entry: LocalVariable = {
            startPC: buffer.getUint16(),
            length: buffer.getUint16(),
            nameIndex: buffer.getUint16(),
            descriptorIndex: buffer.getUint16(),
            index: buffer.getUint16(),
        };

        entry.nameEntry = pool[entry.nameIndex] as UTF8Entry | undefined;
        entry.descriptorEntry = pool[entry.descriptorIndex] as UTF8Entry | undefined;

        entries[i] = entry;
    }

    return {
        ...attr,
        type: AttributeType.LOCAL_VARIABLE_TABLE,
        entries,
    };
};

export const writeLocalVariableTable = (attr: LocalVariableTableAttribute): Uint8Array => {
    const buffer = create(2 + attr.entries.length * 10);
    buffer.setUint16(attr.entries.length);

    for (const entry of attr.entries) {
        if (entry.nameEntry) {
            entry.nameIndex = entry.nameEntry.index;
        }
        if (entry.descriptorEntry) {
            entry.descriptorIndex = entry.descriptorEntry.index;
        }

        buffer.setUint16(entry.startPC);
        buffer.setUint16(entry.length);
        buffer.setUint16(entry.nameIndex);
        buffer.setUint16(entry.descriptorIndex);
        buffer.setUint16(entry.index);
    }

    return buffer.arrayView;
};

export const findLocals = (attrib: Attributable, offset: number): LocalVariable[] => {
    const locals: LocalVariable[] = [];
    for (const attr of attrib.attrs) {
        if (attr.type !== AttributeType.LOCAL_VARIABLE_TABLE) continue;

        locals.push(
            ...(attr as LocalVariableTableAttribute).entries.filter(
                (e) => offset >= e.startPC && offset < e.startPC + e.length
            )
        );
    }

    return locals;
};

export const localSize = (desc: string): number => {
    switch (desc) {
        case "D":
        case "J":
            return 2;
        case "V":
            return 0;
    }

    return 1;
};
