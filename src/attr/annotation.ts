import { Buffer, create, wrap } from "../buffer";
import type { Entry, Pool, UTF8Entry } from "../pool";
import { AttributeType, ElementTag } from "../spec";
import type { Attribute } from "./";

export interface ElementValue {
    tag: ElementTag;
}

export interface ConstElementValue extends ElementValue {
    tag:
        | ElementTag.BYTE
        | ElementTag.CHAR
        | ElementTag.DOUBLE
        | ElementTag.FLOAT
        | ElementTag.INT
        | ElementTag.LONG
        | ElementTag.SHORT
        | ElementTag.BOOLEAN
        | ElementTag.STRING;

    value: number; // index of UTF8Entry, NumberEntry, LongEntry
    valueEntry?: Entry;
}

export interface EnumElementValue extends ElementValue {
    tag: ElementTag.ENUM;

    typeName: number; // UTF8Entry index
    constName: number; // UTF8Entry index

    typeNameEntry?: UTF8Entry;
    constNameEntry?: UTF8Entry;
}

export interface ClassElementValue extends ElementValue {
    tag: ElementTag.CLASS;

    classInfo: number; // UTF8Entry index
    classInfoEntry?: UTF8Entry;
}

export interface AnnotationElementValue extends ElementValue {
    tag: ElementTag.ANNOTATION;

    annotation: Annotation;
}

export interface ArrayElementValue extends ElementValue {
    tag: ElementTag.ARRAY;

    values: ElementValue[];
}

export interface ElementValuePair {
    name: number; // UTF8Entry index
    nameEntry?: UTF8Entry;

    value: ElementValue;
}

export interface Annotation {
    type: number;
    typeEntry?: UTF8Entry;

    values: ElementValuePair[];
}

export interface AnnotationsAttribute extends Attribute {
    type: AttributeType.RUNTIME_VISIBLE_ANNOTATIONS | AttributeType.RUNTIME_INVISIBLE_ANNOTATIONS;

    annotations: Annotation[];
}

export interface ParameterAnnotationsAttribute extends Attribute {
    type: AttributeType.RUNTIME_VISIBLE_PARAMETER_ANNOTATIONS | AttributeType.RUNTIME_INVISIBLE_PARAMETER_ANNOTATIONS;

    parameters: Annotation[][];
}

export interface AnnotationDefaultAttribute extends Attribute {
    type: AttributeType.ANNOTATION_DEFAULT;

    defaultValue: ElementValue;
}

const readConstElementValue = (tag: ElementTag, buffer: Buffer, pool: Entry[]): ConstElementValue => {
    const value = buffer.getUint16();
    return {
        tag: tag as ConstElementValue["tag"],
        value,
        valueEntry: pool[value],
    };
};

const readEnumElementValue = (buffer: Buffer, pool: Entry[]): EnumElementValue => {
    const typeName = buffer.getUint16();
    const constName = buffer.getUint16();
    return {
        tag: ElementTag.ENUM,
        typeName,
        constName,
        typeNameEntry: pool[typeName] as UTF8Entry | undefined,
        constNameEntry: pool[constName] as UTF8Entry | undefined,
    };
};

const readClassElementValue = (buffer: Buffer, pool: Entry[]): ClassElementValue => {
    const classInfo = buffer.getUint16();
    return {
        tag: ElementTag.CLASS,
        classInfo,
        classInfoEntry: pool[classInfo] as UTF8Entry | undefined,
    };
};

const readAnnotationElementValue = (buffer: Buffer, pool: Entry[]): AnnotationElementValue => {
    const annotation = readAnnotation(buffer, pool);
    return {
        tag: ElementTag.ANNOTATION,
        annotation,
    };
};

const readArrayElementValue = (buffer: Buffer, pool: Entry[]): ArrayElementValue => {
    const numValues = buffer.getUint16();
    const values = new Array<ElementValue>(numValues);
    for (let i = 0; i < numValues; i++) {
        values[i] = readElementValue(buffer, pool);
    }
    return {
        tag: ElementTag.ARRAY,
        values,
    };
};

const readElementValue = (buffer: Buffer, pool: Entry[]): ElementValue => {
    const tag = String.fromCharCode(buffer.getUint8());
    switch (tag) {
        case ElementTag.BYTE:
        case ElementTag.CHAR:
        case ElementTag.DOUBLE:
        case ElementTag.FLOAT:
        case ElementTag.INT:
        case ElementTag.LONG:
        case ElementTag.SHORT:
        case ElementTag.BOOLEAN:
        case ElementTag.STRING:
            return readConstElementValue(tag, buffer, pool);
        case ElementTag.ENUM:
            return readEnumElementValue(buffer, pool);
        case ElementTag.CLASS:
            return readClassElementValue(buffer, pool);
        case ElementTag.ANNOTATION:
            return readAnnotationElementValue(buffer, pool);
        case ElementTag.ARRAY:
            return readArrayElementValue(buffer, pool);
        default:
            throw new Error(`Unknown element value tag ${tag}`);
    }
};

const readAnnotation = (buffer: Buffer, pool: Pool): Annotation => {
    const type = buffer.getUint16();
    const numValues = buffer.getUint16();
    const values = new Array<ElementValuePair>(numValues);
    for (let i = 0; i < numValues; i++) {
        const name = buffer.getUint16();
        const value = readElementValue(buffer, pool);
        values[i] = {
            name,
            nameEntry: pool[name] as UTF8Entry | undefined,
            value,
        };
    }
    return {
        type,
        typeEntry: pool[type] as UTF8Entry | undefined,
        values,
    };
};

export const readAnnotations = (attr: Attribute, pool: Pool): AnnotationsAttribute => {
    const buffer = wrap(attr.data);

    const numAnnotations = buffer.getUint16();
    const annotations = new Array<Annotation>(numAnnotations);
    for (let i = 0; i < numAnnotations; i++) {
        annotations[i] = readAnnotation(buffer, pool);
    }

    return {
        ...attr,
        type: attr.name.string as AnnotationsAttribute["type"],
        annotations,
    };
};

export const readParameterAnnotations = (attr: Attribute, pool: Pool): ParameterAnnotationsAttribute => {
    const buffer = wrap(attr.data);

    const numParameters = buffer.getUint8();
    const parameters = new Array<Annotation[]>(numParameters);
    for (let i = 0; i < numParameters; i++) {
        const numAnnotations = buffer.getUint16();
        const annotations = new Array<Annotation>(numAnnotations);
        for (let j = 0; j < numAnnotations; j++) {
            annotations[j] = readAnnotation(buffer, pool);
        }
        parameters[i] = annotations;
    }

    return {
        ...attr,
        type: attr.name.string as ParameterAnnotationsAttribute["type"],
        parameters,
    };
};

export const readAnnotationDefault = (attr: Attribute, pool: Pool): AnnotationDefaultAttribute => {
    const buffer = wrap(attr.data);

    const defaultValue = readElementValue(buffer, pool);
    return {
        ...attr,
        type: AttributeType.ANNOTATION_DEFAULT,
        defaultValue,
    };
};

const writeConstElementValue = (buffer: Buffer, value: ConstElementValue) => {
    buffer.setUint8(value.tag.charCodeAt(0));
    buffer.setUint16(value.value);
};

const writeEnumElementValue = (buffer: Buffer, value: EnumElementValue) => {
    buffer.setUint8(ElementTag.ENUM.charCodeAt(0));
    buffer.setUint16(value.typeName);
    buffer.setUint16(value.constName);
};

const writeClassElementValue = (buffer: Buffer, value: ClassElementValue) => {
    buffer.setUint8(ElementTag.CLASS.charCodeAt(0));
    buffer.setUint16(value.classInfo);
};

const writeAnnotationElementValue = (buffer: Buffer, value: AnnotationElementValue) => {
    buffer.setUint8(ElementTag.ANNOTATION.charCodeAt(0));
    writeAnnotation(buffer, value.annotation);
};

const writeArrayElementValue = (buffer: Buffer, value: ArrayElementValue) => {
    buffer.setUint8(ElementTag.ARRAY.charCodeAt(0));
    buffer.setUint16(value.values.length);
    for (const val of value.values) {
        writeElementValue(buffer, val);
    }
};

const writeElementValue = (buffer: Buffer, value: ElementValue) => {
    switch (value.tag) {
        case ElementTag.BYTE:
        case ElementTag.CHAR:
        case ElementTag.DOUBLE:
        case ElementTag.FLOAT:
        case ElementTag.INT:
        case ElementTag.LONG:
        case ElementTag.SHORT:
        case ElementTag.BOOLEAN:
        case ElementTag.STRING:
            writeConstElementValue(buffer, value as ConstElementValue);
            break;
        case ElementTag.ENUM:
            writeEnumElementValue(buffer, value as EnumElementValue);
            break;
        case ElementTag.CLASS:
            writeClassElementValue(buffer, value as ClassElementValue);
            break;
        case ElementTag.ANNOTATION:
            writeAnnotationElementValue(buffer, value as AnnotationElementValue);
            break;
        case ElementTag.ARRAY:
            writeArrayElementValue(buffer, value as ArrayElementValue);
            break;
        default:
            throw new Error(`Unknown element value tag ${value.tag}`);
    }
};

const writeAnnotation = (buffer: Buffer, annotation: Annotation) => {
    buffer.setUint16(annotation.type);
    buffer.setUint16(annotation.values.length);
    for (const pair of annotation.values) {
        buffer.setUint16(pair.name);
        writeElementValue(buffer, pair.value);
    }
};

export const writeAnnotations = (attr: AnnotationsAttribute): Uint8Array => {
    const buffer = create();

    buffer.setUint16(attr.annotations.length);
    for (const annotation of attr.annotations) {
        writeAnnotation(buffer, annotation);
    }

    return buffer.arrayView;
};

export const writeParameterAnnotations = (attr: ParameterAnnotationsAttribute): Uint8Array => {
    const buffer = create();

    buffer.setUint8(attr.parameters.length);
    for (const annotations of attr.parameters) {
        buffer.setUint16(annotations.length);
        for (const annotation of annotations) {
            writeAnnotation(buffer, annotation);
        }
    }

    return buffer.arrayView;
};

export const writeAnnotationDefault = (attr: AnnotationDefaultAttribute): Uint8Array => {
    const buffer = create();

    writeElementValue(buffer, attr.defaultValue);
    return buffer.arrayView;
};
