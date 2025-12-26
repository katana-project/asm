import { type DirtyMarkable, FLAG_SKIP_ATTR, FLAG_SKIP_ATTR_PARSE, FLAG_SLICE_BUFFER } from "../";
import type { Buffer } from "../buffer";
import type { Pool, UTF8Entry } from "../pool";
import { AttributeType } from "../spec";
import {
    type Annotation,
    type AnnotationDefaultAttribute,
    type AnnotationElementValue,
    type AnnotationsAttribute,
    type ArrayElementValue,
    type ClassElementValue,
    type ConstElementValue,
    type ElementValue,
    type ElementValuePair,
    type EnumElementValue,
    type ParameterAnnotationsAttribute,
    readAnnotationDefault,
    readAnnotations,
    readParameterAnnotations,
    writeAnnotationDefault,
    writeAnnotations,
    writeParameterAnnotations,
} from "./annotation";
import {
    type BootstrapMethod,
    type BootstrapMethodArgument,
    type BootstrapMethodsAttribute,
    readBootstrapMethods,
    writeBootstrapMethods,
} from "./bsm";
import { type CodeAttribute, type ExceptionTableEntry, readCode, writeCode } from "./code";
import { type ConstantValueAttribute, readConstantValue, writeConstantValue } from "./constant_value";
import { type EnclosingMethodAttribute, readEnclosingMethod, writeEnclosingMethod } from "./enclosing_method";
import { type ExceptionEntry, type ExceptionsAttribute, readExceptions, writeExceptions } from "./exceptions";
import { type InnerClass, type InnerClassesAttribute, readInnerClasses, writeInnerClasses } from "./inner_classes";
import {
    type LineNumberTableAttribute,
    type LineNumberTableEntry,
    readLineNumberTable,
    writeLineNumberTable,
} from "./lnt";
import {
    type LocalVariable,
    type LocalVariableTableAttribute,
    readLocalVariableTable,
    writeLocalVariableTable,
} from "./lvt";
import {
    type MethodParameter,
    type MethodParametersAttribute,
    readMethodParameters,
    writeMethodParameters,
} from "./method_params";
import {
    type ModuleAttribute,
    type ModuleExportsOpens,
    type ModuleMainClassAttribute,
    type ModulePackage,
    type ModulePackagesAttribute,
    type ModuleProvides,
    type ModuleRelation,
    type ModuleRequires,
    readModule,
    readModuleMainClass,
    readModulePackages,
    writeModule,
    writeModuleMainClass,
    writeModulePackages,
} from "./module";
import {
    type NestHostAttribute,
    type NestMember,
    type NestMembersAttribute,
    readNestHost,
    readNestMembers,
    writeNestHost,
    writeNestMembers,
} from "./nest";
import {
    type PermittedSubclass,
    type PermittedSubclassesAttribute,
    readPermittedSubclasses,
    writePermittedSubclasses,
} from "./permitted_subclasses";
import { readRecord, type RecordAttribute, type RecordComponent, writeRecord } from "./record";
import { readSignature, type SignatureAttribute, writeSignature } from "./signature";
import {
    readSourceDebugExtension,
    type SourceDebugExtensionAttribute,
    writeSourceDebugExtension,
} from "./source_debug_ext";
import { readSourceFile, type SourceFileAttribute, writeSourceFile } from "./source_file";

export interface Attribute extends DirtyMarkable {
    type?: AttributeType;
    nameIndex: number;
    data: Uint8Array;

    name?: UTF8Entry; // not present if index is invalid
}

export interface Attributable {
    attrs: Attribute[];
}

const readSingle = (buffer: Buffer, pool: Pool, flags: number): Attribute => {
    const nameIndex = buffer.getUint16();
    const name = pool[nameIndex] as UTF8Entry | undefined;

    const data = buffer.get(buffer.getInt32(), (flags & FLAG_SLICE_BUFFER) !== 0);

    let attr: Attribute = {
        dirty: false,
        nameIndex,
        data,
        name,
    };
    if ((flags & FLAG_SKIP_ATTR_PARSE) === 0) {
        try {
            switch (name?.string) {
                case AttributeType.CODE:
                    attr = readCode(attr, pool, flags);
                    break;
                case AttributeType.SOURCE_FILE:
                    attr = readSourceFile(attr, pool);
                    break;
                case AttributeType.SIGNATURE:
                    attr = readSignature(attr, pool);
                    break;
                case AttributeType.LOCAL_VARIABLE_TABLE:
                case AttributeType.LOCAL_VARIABLE_TYPE_TABLE:
                    attr = readLocalVariableTable(attr, pool);
                    break;
                case AttributeType.EXCEPTIONS:
                    attr = readExceptions(attr, pool);
                    break;
                case AttributeType.CONSTANT_VALUE:
                    attr = readConstantValue(attr, pool);
                    break;
                case AttributeType.BOOTSTRAP_METHODS:
                    attr = readBootstrapMethods(attr, pool);
                    break;
                case AttributeType.RECORD:
                    attr = readRecord(attr, pool, flags);
                    break;
                case AttributeType.PERMITTED_SUBCLASSES:
                    attr = readPermittedSubclasses(attr, pool);
                    break;
                case AttributeType.NEST_HOST:
                    attr = readNestHost(attr, pool);
                    break;
                case AttributeType.NEST_MEMBERS:
                    attr = readNestMembers(attr, pool);
                    break;
                case AttributeType.INNER_CLASSES:
                    attr = readInnerClasses(attr, pool);
                    break;
                case AttributeType.ENCLOSING_METHOD:
                    attr = readEnclosingMethod(attr, pool);
                    break;
                case AttributeType.SOURCE_DEBUG_EXTENSION:
                    attr = readSourceDebugExtension(attr);
                    break;
                case AttributeType.LINE_NUMBER_TABLE:
                    attr = readLineNumberTable(attr);
                    break;
                case AttributeType.METHOD_PARAMETERS:
                    attr = readMethodParameters(attr, pool);
                    break;
                case AttributeType.MODULE:
                    attr = readModule(attr, pool);
                    break;
                case AttributeType.MODULE_MAIN_CLASS:
                    attr = readModuleMainClass(attr, pool);
                    break;
                case AttributeType.MODULE_PACKAGES:
                    attr = readModulePackages(attr, pool);
                    break;
                case AttributeType.RUNTIME_VISIBLE_ANNOTATIONS:
                case AttributeType.RUNTIME_INVISIBLE_ANNOTATIONS:
                    attr = readAnnotations(attr, pool);
                    break;
                case AttributeType.RUNTIME_VISIBLE_PARAMETER_ANNOTATIONS:
                case AttributeType.RUNTIME_INVISIBLE_PARAMETER_ANNOTATIONS:
                    attr = readParameterAnnotations(attr, pool);
                    break;
                case AttributeType.ANNOTATION_DEFAULT:
                    attr = readAnnotationDefault(attr, pool);
                    break;
                case AttributeType.DEPRECATED:
                case AttributeType.SYNTHETIC:
                    // zero-length attributes
                    attr.type = attr.name.string as AttributeType;
                    break;
            }
        } catch (e) {
            console.warn(`failed to parse ${name?.string || "unknown"} attribute, data length ${data.length}`);
            console.error(e);
        }
    }

    return attr;
};

export const readAttrs = (buffer: Buffer, pool: Pool, flags: number = 0): Attribute[] => {
    const attributesCount = buffer.getUint16();

    let attributes: Attribute[] = [];
    if ((flags & FLAG_SKIP_ATTR) === 0) {
        attributes = new Array<Attribute>(attributesCount);
        for (let i = 0; i < attributesCount; i++) {
            attributes[i] = readSingle(buffer, pool, flags);
        }
    } else {
        // skip attributes entirely
        for (let i = 0; i < attributesCount; i++) {
            buffer.offset += 2;
            const length = buffer.getInt32();
            buffer.offset += length;
        }
    }

    return attributes;
};

const writeSingle = (buffer: Buffer, attr: Attribute) => {
    if (attr.dirty) {
        // rebuild data if dirty
        switch (attr.type) {
            case AttributeType.CODE:
                attr.data = writeCode(attr as CodeAttribute);
                break;
            case AttributeType.SOURCE_FILE:
                attr.data = writeSourceFile(attr as SourceFileAttribute);
                break;
            case AttributeType.SIGNATURE:
                attr.data = writeSignature(attr as SignatureAttribute);
                break;
            case AttributeType.LOCAL_VARIABLE_TABLE:
            case AttributeType.LOCAL_VARIABLE_TYPE_TABLE:
                attr.data = writeLocalVariableTable(attr as LocalVariableTableAttribute);
                break;
            case AttributeType.EXCEPTIONS:
                attr.data = writeExceptions(attr as ExceptionsAttribute);
                break;
            case AttributeType.CONSTANT_VALUE:
                attr.data = writeConstantValue(attr as ConstantValueAttribute);
                break;
            case AttributeType.BOOTSTRAP_METHODS:
                attr.data = writeBootstrapMethods(attr as BootstrapMethodsAttribute);
                break;
            case AttributeType.RECORD:
                attr.data = writeRecord(attr as RecordAttribute);
                break;
            case AttributeType.PERMITTED_SUBCLASSES:
                attr.data = writePermittedSubclasses(attr as PermittedSubclassesAttribute);
                break;
            case AttributeType.NEST_HOST:
                attr.data = writeNestHost(attr as NestHostAttribute);
                break;
            case AttributeType.NEST_MEMBERS:
                attr.data = writeNestMembers(attr as NestMembersAttribute);
                break;
            case AttributeType.INNER_CLASSES:
                attr.data = writeInnerClasses(attr as InnerClassesAttribute);
                break;
            case AttributeType.ENCLOSING_METHOD:
                attr.data = writeEnclosingMethod(attr as EnclosingMethodAttribute);
                break;
            case AttributeType.SOURCE_DEBUG_EXTENSION:
                attr.data = writeSourceDebugExtension(attr as SourceDebugExtensionAttribute);
                break;
            case AttributeType.LINE_NUMBER_TABLE:
                attr.data = writeLineNumberTable(attr as LineNumberTableAttribute);
                break;
            case AttributeType.METHOD_PARAMETERS:
                attr.data = writeMethodParameters(attr as MethodParametersAttribute);
                break;
            case AttributeType.MODULE:
                attr.data = writeModule(attr as ModuleAttribute);
                break;
            case AttributeType.MODULE_MAIN_CLASS:
                attr.data = writeModuleMainClass(attr as ModuleMainClassAttribute);
                break;
            case AttributeType.MODULE_PACKAGES:
                attr.data = writeModulePackages(attr as ModulePackagesAttribute);
                break;
            case AttributeType.RUNTIME_VISIBLE_ANNOTATIONS:
            case AttributeType.RUNTIME_INVISIBLE_ANNOTATIONS:
                attr.data = writeAnnotations(attr as AnnotationsAttribute);
                break;
            case AttributeType.RUNTIME_VISIBLE_PARAMETER_ANNOTATIONS:
            case AttributeType.RUNTIME_INVISIBLE_PARAMETER_ANNOTATIONS:
                attr.data = writeParameterAnnotations(attr as ParameterAnnotationsAttribute);
                break;
            case AttributeType.ANNOTATION_DEFAULT:
                attr.data = writeAnnotationDefault(attr as AnnotationDefaultAttribute);
                break;
            case AttributeType.DEPRECATED:
            case AttributeType.SYNTHETIC:
                // zero-length attributes
                attr.data = new Uint8Array(0);
                break;
        }

        attr.dirty = false;
    }

    buffer.setUint16(attr.nameIndex);
    buffer.setInt32(attr.data.length);
    buffer.set(attr.data);
};

export const writeAttrs = (buffer: Buffer, attrs: Attribute[]) => {
    buffer.setUint16(attrs.length);
    for (const attr of attrs) {
        writeSingle(buffer, attr);
    }
};

export {
    Annotation,
    AnnotationDefaultAttribute,
    AnnotationElementValue,
    AnnotationsAttribute,
    ArrayElementValue,
    BootstrapMethod,
    BootstrapMethodArgument,
    BootstrapMethodsAttribute,
    ClassElementValue,
    CodeAttribute,
    ConstantValueAttribute,
    ConstElementValue,
    ElementValue,
    ElementValuePair,
    EnclosingMethodAttribute,
    EnumElementValue,
    ExceptionEntry,
    ExceptionsAttribute,
    ExceptionTableEntry,
    InnerClass,
    InnerClassesAttribute,
    LineNumberTableAttribute,
    LineNumberTableEntry,
    LocalVariable,
    LocalVariableTableAttribute,
    MethodParameter,
    MethodParametersAttribute,
    ModuleAttribute,
    ModuleExportsOpens,
    ModuleMainClassAttribute,
    ModulePackage,
    ModulePackagesAttribute,
    ModuleProvides,
    ModuleRelation,
    ModuleRequires,
    NestHostAttribute,
    NestMember,
    NestMembersAttribute,
    ParameterAnnotationsAttribute,
    PermittedSubclass,
    PermittedSubclassesAttribute,
    RecordAttribute,
    RecordComponent,
    SignatureAttribute,
    SourceDebugExtensionAttribute,
    SourceFileAttribute,
};
