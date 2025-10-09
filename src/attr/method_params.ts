import { create, wrap } from "../buffer";
import type { Pool, UTF8Entry } from "../pool";
import { AttributeType } from "../spec";
import type { Attribute } from "./";

export interface MethodParameter {
    nameIndex: number; // UTF8Entry index, may be 0
    accessFlags: number;

    nameEntry?: UTF8Entry;
}

export interface MethodParametersAttribute extends Attribute {
    type: AttributeType.METHOD_PARAMETERS;

    parameters: MethodParameter[];
}

export const readMethodParameters = (attr: Attribute, pool: Pool): MethodParametersAttribute => {
    const buffer = wrap(attr.data);

    const numParameters = buffer.getUint8();
    const parameters = new Array<MethodParameter>(numParameters);
    for (let i = 0; i < numParameters; i++) {
        const nameIndex = buffer.getUint16();
        const accessFlags = buffer.getUint16();

        parameters[i] = { nameIndex, accessFlags, nameEntry: pool[nameIndex] as UTF8Entry | undefined };
    }

    return { ...attr, type: AttributeType.METHOD_PARAMETERS, parameters };
};

export const writeMethodParameters = (attr: MethodParametersAttribute): Uint8Array => {
    const buffer = create(attr.parameters.length * 4 + 1);

    buffer.setUint8(attr.parameters.length);
    for (const param of attr.parameters) {
        if (param.nameEntry) {
            param.nameIndex = param.nameEntry.index;
        }

        buffer.setUint16(param.nameIndex);
        buffer.setUint16(param.accessFlags);
    }

    return buffer.arrayView;
};
