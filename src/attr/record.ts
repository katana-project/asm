import { create, wrap } from "../buffer";
import type { Pool, UTF8Entry } from "../pool";
import { AttributeType } from "../spec";
import { type Attributable, type Attribute, readAttrs, writeAttrs } from "./";

export interface RecordComponent extends Attributable {
    name: number;
    nameEntry?: UTF8Entry;

    descriptor: number;
    descriptorEntry?: UTF8Entry;
}

export interface RecordAttribute extends Attribute {
    type: AttributeType.RECORD;

    components: RecordComponent[];
}

export const readRecord = (attr: Attribute, pool: Pool, flags: number = 0): RecordAttribute => {
    const buffer = wrap(attr.data);

    const numComponents = buffer.getUint16();
    const components = new Array<RecordComponent>(numComponents);
    for (let i = 0; i < numComponents; i++) {
        components[i] = {
            name: buffer.getUint16(),
            descriptor: buffer.getUint16(),
            attrs: readAttrs(buffer, pool, flags),
        };
    }

    return { ...attr, type: AttributeType.RECORD, components };
};

export const writeRecord = (attr: RecordAttribute): Uint8Array => {
    const buffer = create(2 + attr.components.length * 32 /* estimate - 4 for name+desc, the rest for attributes */);

    buffer.setUint16(attr.components.length);
    for (const component of attr.components) {
        if (component.nameEntry) {
            component.name = component.nameEntry.index;
        }
        buffer.setUint16(component.name);

        if (component.descriptorEntry) {
            component.descriptor = component.descriptorEntry.index;
        }
        buffer.setUint16(component.descriptor);

        writeAttrs(buffer, component.attrs);
    }

    return buffer.arrayView;
};
