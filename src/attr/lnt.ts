import { create, wrap } from "../buffer";
import { AttributeType } from "../spec";
import type { Attribute } from "./";

export interface LineNumberTableEntry {
    startPC: number;
    lineNumber: number;
}

export interface LineNumberTableAttribute extends Attribute {
    type: AttributeType.LINE_NUMBER_TABLE;

    entries: LineNumberTableEntry[];
}

export const readLineNumberTable = (attr: Attribute): LineNumberTableAttribute => {
    const buffer = wrap(attr.data);

    const numEntries = buffer.getUint16();
    const entries = new Array<LineNumberTableEntry>(numEntries);
    for (let i = 0; i < numEntries; i++) {
        entries[i] = {
            startPC: buffer.getUint16(),
            lineNumber: buffer.getUint16(),
        };
    }

    return { ...attr, type: AttributeType.LINE_NUMBER_TABLE, entries };
};

export const writeLineNumberTable = (attr: LineNumberTableAttribute): Uint8Array => {
    const buffer = create(2 + attr.entries.length * 4);

    buffer.setUint16(attr.entries.length);
    for (const entry of attr.entries) {
        buffer.setUint16(entry.startPC);
        buffer.setUint16(entry.lineNumber);
    }

    return buffer.arrayView;
};
