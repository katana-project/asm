import { AttributeType } from "../spec";
import type { Attribute } from "./";

export interface SourceDebugExtensionAttribute extends Attribute {
    type: AttributeType.SOURCE_DEBUG_EXTENSION;

    // raw bytes are in `data`
    debugExtension: string; // mark the attribute as dirty if this is changed
}

const decoder = new TextDecoder("utf-8");
export const readSourceDebugExtension = (attr: Attribute): SourceDebugExtensionAttribute => {
    return {
        ...attr,
        type: AttributeType.SOURCE_DEBUG_EXTENSION,
        debugExtension: decoder.decode(attr.data),
    };
};

const encoder = new TextEncoder();
export const writeSourceDebugExtension = (attr: SourceDebugExtensionAttribute): Uint8Array => {
    return encoder.encode(attr.debugExtension);
};
