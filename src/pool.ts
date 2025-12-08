import { DirtyMarkable, FLAG_SLICE_BUFFER } from "./";
import { type Buffer, wrap } from "./buffer";
import { ConstantType, HandleKind } from "./spec";

export interface Entry {
    type: ConstantType;
    index: number;
}

export interface NumericEntry<T> extends Entry {
    type: ConstantType.INTEGER | ConstantType.LONG | ConstantType.FLOAT | ConstantType.DOUBLE;
    value: T;
}

export interface NumberEntry extends NumericEntry<number> {
    type: ConstantType.INTEGER | ConstantType.FLOAT | ConstantType.DOUBLE;
}

export interface LongEntry extends NumericEntry<bigint> {
    type: ConstantType.LONG;
}

export interface ClassEntry extends Entry {
    type: ConstantType.CLASS;
    name: number; // UTF8Entry index
}

export interface UTF8Entry extends Entry, DirtyMarkable {
    type: ConstantType.UTF8;
    string: string; // mark as dirty if you want the writer to encode the string into bytes
    bytes: Uint8Array;
}

export interface StringEntry extends Entry {
    type: ConstantType.STRING;
    data: number; // UTF8Entry index
}

export interface NameTypeEntry extends Entry {
    type: ConstantType.NAME_AND_TYPE;
    name: number; // UTF8Entry index
    type_: number; // UTF8Entry index
}

export interface RefEntry extends Entry {
    type: ConstantType.FIELDREF | ConstantType.METHODREF | ConstantType.INTERFACE_METHODREF;
    ref: number; // ClassEntry index
    nameType: number; // NameTypeEntry index
}

export interface ModularEntry extends Entry {
    type: ConstantType.MODULE | ConstantType.PACKAGE;
    name: number; // UTF8Entry index
}

export interface DynamicEntry extends Entry {
    type: ConstantType.DYNAMIC | ConstantType.INVOKE_DYNAMIC;
    bsmIndex: number;
    nameType: number; // NameTypeEntry index
}

export interface HandleEntry extends Entry {
    type: ConstantType.METHOD_HANDLE;
    ref: number; // RefEntry index
    kind: HandleKind;
}

export interface MethodTypeEntry extends Entry {
    type: ConstantType.METHOD_TYPE;
    descriptor: number; // UTF8Entry index
}

export type Pool = (Entry | null)[];

const decoder = new TextDecoder();
const readSingle = (buffer: Buffer, index: number): Entry => {
    const type = buffer.getUint8();
    switch (type) {
        case ConstantType.UTF8:
            const length = buffer.getUint16();
            const data = buffer.get(length);

            return {
                type,
                index,
                string: decoder.decode(data),
                bytes: data,
                dirty: false,
            } as UTF8Entry;
        case ConstantType.INTEGER:
            return { type, index, value: buffer.getInt32() } as NumberEntry;
        case ConstantType.FLOAT:
            return { type, index, value: buffer.getFloat32() } as NumberEntry;
        case ConstantType.LONG:
            return { type, index, value: buffer.getBigInt64() } as LongEntry;
        case ConstantType.DOUBLE:
            return { type, index, value: buffer.getFloat64() } as NumberEntry;
        case ConstantType.CLASS:
            return { type, index, name: buffer.getUint16() } as ClassEntry;
        case ConstantType.STRING:
            return { type, index, data: buffer.getUint16() } as StringEntry;
        case ConstantType.METHOD_TYPE:
            return { type, index, descriptor: buffer.getUint16() } as MethodTypeEntry;
        case ConstantType.MODULE:
        case ConstantType.PACKAGE:
            return { type, index, name: buffer.getUint16() } as ModularEntry;
        case ConstantType.FIELDREF:
        case ConstantType.METHODREF:
        case ConstantType.INTERFACE_METHODREF:
            return {
                type,
                index,
                ref: buffer.getUint16(),
                nameType: buffer.getUint16(),
            } as RefEntry;
        case ConstantType.NAME_AND_TYPE:
            return {
                type,
                index,
                name: buffer.getUint16(),
                type_: buffer.getUint16(),
            } as NameTypeEntry;
        case ConstantType.DYNAMIC:
        case ConstantType.INVOKE_DYNAMIC:
            return {
                type,
                index,
                bsmIndex: buffer.getUint16(),
                nameType: buffer.getUint16(),
            } as DynamicEntry;
        case ConstantType.METHOD_HANDLE:
            return { type, index, kind: buffer.getUint8(), ref: buffer.getUint16() } as HandleEntry;
        default:
            throw new Error("Unrecognized constant pool tag " + type + " at position " + index);
    }
};

// computes the total length of the constant pool entry space and resets the cursor
const computeLength = (buffer: Buffer, size: number): number => {
    let length = 0;

    for (let i = 1; i < size; i++) {
        const type = buffer.getUint8();
        length += 1;

        switch (type) {
            case ConstantType.UTF8:
                const len = buffer.getUint16();
                buffer.offset += len;
                length += 2 + len;
                break;
            case ConstantType.INTEGER:
            case ConstantType.FLOAT:
            case ConstantType.FIELDREF:
            case ConstantType.METHODREF:
            case ConstantType.INTERFACE_METHODREF:
            case ConstantType.NAME_AND_TYPE:
            case ConstantType.DYNAMIC:
            case ConstantType.INVOKE_DYNAMIC:
                buffer.offset += 4;
                length += 4;
                break;
            case ConstantType.LONG:
            case ConstantType.DOUBLE:
                i++;
                buffer.offset += 8;
                length += 8;
                break;
            case ConstantType.CLASS:
            case ConstantType.STRING:
            case ConstantType.METHOD_TYPE:
            case ConstantType.MODULE:
            case ConstantType.PACKAGE:
                buffer.offset += 2;
                length += 2;
                break;
            case ConstantType.METHOD_HANDLE:
                buffer.offset += 3;
                length += 3;
                break;
            default:
                throw new Error("Unrecognized constant pool tag " + type + " at position " + i);
        }
    }

    buffer.offset -= length;
    return length;
};

export const readPool = (buffer: Buffer, flags: number = 0): Pool => {
    const size = buffer.getUint16();

    const pool = new Array<Entry | null>(size);
    pool.fill(null);

    const poolBuffer = (flags & FLAG_SLICE_BUFFER) === 0 ? buffer : wrap(buffer.get(computeLength(buffer, size), true));
    for (let i = 1; i < size; i++) {
        const entry = readSingle(poolBuffer, i);
        pool[i] = entry;

        if (entry.type === ConstantType.DOUBLE || entry.type === ConstantType.LONG) {
            i++; // longs and doubles take two pool entries
        }
    }

    return pool;
};

const encoder = new TextEncoder();
const writeSingle = (buffer: Buffer, entry: Entry) => {
    buffer.setUint8(entry.type);
    switch (entry.type) {
        case ConstantType.UTF8:
            const utf8Entry = entry as UTF8Entry;
            if (utf8Entry.dirty) {
                utf8Entry.bytes = encoder.encode(utf8Entry.string);
                utf8Entry.dirty = false;
            }

            buffer.setUint16(utf8Entry.bytes.length);
            buffer.set(utf8Entry.bytes);
            break;
        case ConstantType.INTEGER:
            buffer.setInt32((entry as NumberEntry).value);
            break;
        case ConstantType.FLOAT:
            buffer.setFloat32((entry as NumberEntry).value);
            break;
        case ConstantType.LONG:
            buffer.setBigInt64((entry as LongEntry).value);
            break;
        case ConstantType.DOUBLE:
            buffer.setFloat64((entry as NumberEntry).value);
            break;
        case ConstantType.CLASS:
            buffer.setUint16((entry as ClassEntry).name);
            break;
        case ConstantType.STRING:
            buffer.setUint16((entry as StringEntry).data);
            break;
        case ConstantType.METHOD_TYPE:
            buffer.setUint16((entry as MethodTypeEntry).descriptor);
            break;
        case ConstantType.MODULE:
        case ConstantType.PACKAGE:
            buffer.setUint16((entry as ModularEntry).name);
            break;
        case ConstantType.FIELDREF:
        case ConstantType.METHODREF:
        case ConstantType.INTERFACE_METHODREF:
            const refEntry = entry as RefEntry;

            buffer.setUint16(refEntry.ref);
            buffer.setUint16(refEntry.nameType);
            break;
        case ConstantType.NAME_AND_TYPE:
            const nameTypeEntry = entry as NameTypeEntry;

            buffer.setUint16(nameTypeEntry.name);
            buffer.setUint16(nameTypeEntry.type_);
            break;
        case ConstantType.DYNAMIC:
        case ConstantType.INVOKE_DYNAMIC:
            const dynamicEntry = entry as DynamicEntry;

            buffer.setUint16(dynamicEntry.bsmIndex);
            buffer.setUint16(dynamicEntry.nameType);
            break;
        case ConstantType.METHOD_HANDLE:
            const handleEntry = entry as HandleEntry;

            buffer.setUint8(handleEntry.kind);
            buffer.setUint16(handleEntry.ref);
            break;
        default:
            throw new Error("Unrecognized constant pool tag " + entry.type + " at position " + entry.index);
    }
};

export const writePool = (buffer: Buffer, pool: Pool) => {
    buffer.setUint16(pool.length);
    for (let i = 1; i < pool.length; i++) {
        const entry = pool[i];

        writeSingle(buffer, entry);
        if (entry.type === ConstantType.DOUBLE || entry.type === ConstantType.LONG) {
            i++; // longs and doubles take two pool entries
        }
    }
};
