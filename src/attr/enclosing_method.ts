import { create, wrap } from "../buffer";
import type { ClassEntry, NameTypeEntry, Pool } from "../pool";
import { AttributeType } from "../spec";
import type { Attribute } from "./";

export interface EnclosingMethodAttribute extends Attribute {
    type: AttributeType.ENCLOSING_METHOD;

    classIndex: number; // ClassEntry index
    methodIndex: number; // NameTypeEntry index, may be 0

    classEntry?: ClassEntry;
    methodEntry?: NameTypeEntry;
}

export const readEnclosingMethod = (attr: Attribute, pool: Pool): EnclosingMethodAttribute => {
    const buffer = wrap(attr.data);

    const classIndex = buffer.getUint16();
    const methodIndex = buffer.getUint16();
    return {
        ...attr,
        type: AttributeType.ENCLOSING_METHOD,
        classIndex,
        methodIndex,
        classEntry: pool[classIndex] as ClassEntry | undefined,
        methodEntry: pool[methodIndex] as NameTypeEntry | undefined,
    };
};

export const writeEnclosingMethod = (attr: EnclosingMethodAttribute): Uint8Array => {
    if (attr.classEntry) {
        attr.classIndex = attr.classEntry.index;
    }
    if (attr.methodEntry) {
        attr.methodIndex = attr.methodEntry.index;
    }

    const buffer = create(4);
    buffer.setUint16(attr.classIndex);
    buffer.setUint16(attr.methodIndex);

    return buffer.arrayView;
};
