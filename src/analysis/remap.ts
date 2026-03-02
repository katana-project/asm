import type { Member, Node } from "../";
import type {
    Annotation,
    AnnotationElementValue,
    AnnotationsAttribute,
    ArrayElementValue,
    Attribute,
    BootstrapMethod,
    BootstrapMethodsAttribute,
    ClassElementValue,
    CodeAttribute,
    ElementValue,
    EnclosingMethodAttribute,
    EnumElementValue,
    ExceptionsAttribute,
    InnerClassesAttribute,
    LocalVariableTableAttribute,
    ModuleAttribute,
    ModuleMainClassAttribute,
    NestHostAttribute,
    NestMembersAttribute,
    ParameterAnnotationsAttribute,
    PermittedSubclassesAttribute,
    RecordAttribute,
    SignatureAttribute,
} from "../attr";
import { typeOfElementValue } from "../attr/annotation";
import {
    ArrayInstruction,
    ConstantInstruction,
    Instruction,
    InvokeInstruction,
    LoadStoreInstruction,
    TypeInstruction,
} from "../insn";
import type {
    ClassEntry,
    DynamicEntry,
    Entry,
    HandleEntry,
    MethodTypeEntry,
    NameTypeEntry,
    Pool,
    RefEntry,
    UTF8Entry,
} from "../pool";
import { AttributeType, ConstantType, ElementTag, HandleKind, Opcode } from "../spec";
import { type Type, parseType } from "../type";

export interface Remapper {
    type(type: Type): Type;
    ref(owner: Type, name: string, type: Type): string;
}

interface RemapContext {
    node: Node;
    pool: Pool;
    remapper: Remapper;

    entries: Map<number, Entry>;
}

const createContext = (node: Node, remapper: Remapper): RemapContext => ({
    node,
    pool: node.pool,
    remapper,
    entries: new Map(),
});

const remapUtf8Entry = ({ pool, remapper, entries }: RemapContext, entry: UTF8Entry): UTF8Entry => {
    const unmappedIndex = entry.index;
    const cached = entries.get(unmappedIndex);
    if (cached) {
        return cached as UTF8Entry;
    }

    const parsedType = parseType(entry.string);
    const remappedType = remapper.type(parsedType);
    if (remappedType.value !== parsedType.value) {
        entry = {
            ...entry,
            index: pool.length,
            string: remappedType.value,
            dirty: true,
        };
        pool.push(entry);
    }

    entries.set(unmappedIndex, entry);
    return entry;
};

const remapClassEntry = ({ pool, entries, remapper }: RemapContext, entry: ClassEntry): ClassEntry => {
    const unmappedIndex = entry.index;
    const cached = entries.get(unmappedIndex);
    if (cached) {
        return cached as ClassEntry;
    }

    let nameEntry = entry.nameEntry;

    const type = parseType(`L${nameEntry.string};`);
    const remappedType = remapper.type(type);

    if (remappedType.value !== type.value) {
        nameEntry = {
            ...nameEntry,
            index: pool.length,
            string: remappedType.value.slice(1, -1),
            dirty: true,
        };
        pool.push(nameEntry);

        entry = {
            ...entry,
            index: pool.length,
            name: nameEntry.index,
            nameEntry,
        };
        pool.push(entry);
    }

    entries.set(unmappedIndex, entry);
    return entry;
};

const remapRefEntry = (context: RemapContext, entry: RefEntry): RefEntry => {
    const { pool, remapper, entries } = context;
    const unmappedIndex = entry.index;
    const cached = entries.get(unmappedIndex);
    if (cached) {
        return cached as RefEntry;
    }

    const classEntry = entry.refEntry;
    let nameTypeEntry = entry.nameTypeEntry;
    const nameEntry = nameTypeEntry.nameEntry;
    const typeEntry = nameTypeEntry.typeEntry;

    const ownerType = parseType(`L${classEntry.nameEntry.string};`);
    const refType = parseType(typeEntry.string);
    const remappedName = remapper.ref(ownerType, nameEntry.string, refType);
    const remappedType = remapper.type(refType);

    let newNameEntry = nameEntry;
    if (remappedName !== nameEntry.string) {
        newNameEntry = {
            ...nameEntry,
            index: pool.length,
            string: remappedName,
            dirty: true,
        };
        pool.push(newNameEntry);
    }

    let newTypeEntry = typeEntry;
    if (remappedType.value !== refType.value) {
        newTypeEntry = {
            ...typeEntry,
            index: pool.length,
            string: remappedType.value,
            dirty: true,
        };
        pool.push(newTypeEntry);
    }

    const newClassEntry = remapClassEntry(context, classEntry);
    if (newClassEntry !== classEntry || newNameEntry !== nameEntry || newTypeEntry !== typeEntry) {
        nameTypeEntry = {
            ...nameTypeEntry,
            index: pool.length,
            name: newNameEntry.index,
            nameEntry: newNameEntry,
            type_: newTypeEntry.index,
            typeEntry: newTypeEntry,
        };
        pool.push(nameTypeEntry);

        entry = {
            ...entry,
            index: pool.length,
            ref: newClassEntry.index,
            refEntry: newClassEntry,
            nameType: nameTypeEntry.index,
            nameTypeEntry: nameTypeEntry,
        };
        pool.push(entry);
    }

    entries.set(unmappedIndex, entry);
    return entry;
};

const remapNameTypeEntry = (
    { pool, remapper, entries }: RemapContext,
    entry: NameTypeEntry,
    ownerType?: Type
): NameTypeEntry => {
    const unmappedIndex = entry.index;
    const cached = entries.get(unmappedIndex);
    if (cached) {
        return cached as NameTypeEntry;
    }

    const nameEntry = entry.nameEntry;
    const typeEntry = entry.typeEntry;

    const fieldType = parseType(typeEntry.string);
    const remappedName = ownerType ? remapper.ref(ownerType, nameEntry.string, fieldType) : nameEntry.string;
    const remappedType = remapper.type(fieldType);

    let newNameEntry = nameEntry;
    let newTypeEntry = typeEntry;

    if (remappedName !== nameEntry.string) {
        newNameEntry = {
            ...nameEntry,
            index: pool.length,
            string: remappedName,
            dirty: true,
        };
        pool.push(newNameEntry);
    }

    if (remappedType.value !== fieldType.value) {
        newTypeEntry = {
            ...nameEntry,
            index: pool.length,
            string: remappedType.value,
            dirty: true,
        };
        pool.push(newTypeEntry);
    }

    if (newNameEntry !== nameEntry || newTypeEntry !== typeEntry) {
        entry = {
            ...entry,
            index: pool.length,
            name: newNameEntry.index,
            nameEntry: newNameEntry,
            type_: newTypeEntry.index,
            typeEntry: newTypeEntry,
        };
        pool.push(entry);
    }

    entries.set(unmappedIndex, entry);
    return entry;
};

const remapHandleEntry = (context: RemapContext, entry: HandleEntry): HandleEntry => {
    const { pool, entries } = context;
    const unmappedIndex = entry.index;
    const cached = entries.get(unmappedIndex);
    if (cached) {
        return cached as HandleEntry;
    }

    const refEntry = entry.refEntry;
    const newRefEntry = remapRefEntry(context, refEntry);
    if (newRefEntry !== refEntry) {
        entry = {
            ...entry,
            index: pool.length,
            ref: newRefEntry.index,
            refEntry: newRefEntry,
        };
        pool.push(entry);
    }

    entries.set(unmappedIndex, entry);
    return entry;
};

const isJavaLambdaMetafactory = (handle: HandleEntry): boolean => {
    if (handle.kind !== HandleKind.INVOKE_STATIC) {
        return false;
    }

    const refEntry = handle.refEntry;
    const classEntry = refEntry.refEntry;
    const nameTypeEntry = refEntry.nameTypeEntry;

    const ownerName = classEntry.nameEntry.string;
    const methodName = nameTypeEntry.nameEntry.string;
    const methodDesc = nameTypeEntry.typeEntry.string;

    return (
        ownerName === "java/lang/invoke/LambdaMetafactory" &&
        ((methodName === "metafactory" &&
            methodDesc ===
                "(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/invoke/MethodType;Ljava/lang/invoke/MethodHandle;Ljava/lang/invoke/MethodType;)Ljava/lang/invoke/CallSite;") ||
            (methodName === "altMetafactory" &&
                methodDesc ===
                    "(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;[Ljava/lang/Object;)Ljava/lang/invoke/CallSite;"))
    );
};

const getLambdaImplementedMethod = (
    nameTypeEntry: NameTypeEntry,
    bsm: BootstrapMethod
): { owner: Type; name: string; type: Type } | null => {
    if (!isJavaLambdaMetafactory(bsm.refEntry!)) {
        return null;
    }

    const methodName = nameTypeEntry.nameEntry.string;
    const methodDesc = nameTypeEntry.typeEntry.string;
    if (!methodDesc.endsWith(";") || bsm.args.length === 0) {
        return null;
    }

    const methodTypeArg = bsm.args[0];
    if (methodTypeArg.entry?.type !== ConstantType.METHOD_TYPE) {
        return null;
    }

    const methodTypeEntry = methodTypeArg.entry as MethodTypeEntry;
    const implMethodDesc = methodTypeEntry.descriptorEntry.string;
    const funcItfType = methodDesc.substring(methodDesc.lastIndexOf(")") + 1);
    return {
        owner: parseType(funcItfType),
        name: methodName,
        type: parseType(implMethodDesc),
    };
};

const remapDynamicEntry = (context: RemapContext, entry: DynamicEntry): DynamicEntry => {
    const { node, pool, remapper, entries } = context;
    const unmappedIndex = entry.index;
    const cached = entries.get(unmappedIndex);
    if (cached) {
        return cached as DynamicEntry;
    }

    const nameTypeEntry = entry.nameTypeEntry;
    let newNameTypeEntry: NameTypeEntry | null = null;

    const bsmAttr = node.attrs.find((a) => a.type === AttributeType.BOOTSTRAP_METHODS) as BootstrapMethodsAttribute;
    if (bsmAttr) {
        const bsm = bsmAttr.methods[entry.bsmIndex];
        if (bsm) {
            const lambdaMethod = getLambdaImplementedMethod(nameTypeEntry, bsm);
            if (lambdaMethod) {
                const remappedName = remapper.ref(lambdaMethod.owner, lambdaMethod.name, lambdaMethod.type);
                if (remappedName !== lambdaMethod.name) {
                    const newNameEntry: UTF8Entry = {
                        ...nameTypeEntry.nameEntry,
                        index: pool.length,
                        string: remappedName,
                        dirty: true,
                    };
                    pool.push(newNameEntry);

                    const newTypeEntry = remapUtf8Entry(context, nameTypeEntry.typeEntry);
                    newNameTypeEntry = {
                        ...nameTypeEntry,
                        index: pool.length,
                        name: newNameEntry.index,
                        nameEntry: newNameEntry,
                        type_: newTypeEntry.index,
                        typeEntry: newTypeEntry,
                    };
                    pool.push(newNameTypeEntry);
                }
            }
        }
    }

    if (newNameTypeEntry === null) {
        newNameTypeEntry = remapNameTypeEntry(context, nameTypeEntry);
    }
    if (newNameTypeEntry !== nameTypeEntry) {
        entry = {
            ...entry,
            index: pool.length,
            nameType: newNameTypeEntry.index,
            nameTypeEntry: newNameTypeEntry,
        };
        pool.push(entry);
    }

    entries.set(unmappedIndex, entry);
    return entry;
};

const remapMethodTypeEntry = (context: RemapContext, entry: MethodTypeEntry): MethodTypeEntry => {
    const { pool, entries } = context;
    const unmappedIndex = entry.index;
    const cached = entries.get(unmappedIndex);
    if (cached) {
        return cached as MethodTypeEntry;
    }

    const descriptorEntry = entry.descriptorEntry;
    const newDescriptorEntry = remapUtf8Entry(context, descriptorEntry);
    if (newDescriptorEntry !== descriptorEntry) {
        entry = {
            ...entry,
            index: pool.length,
            descriptor: newDescriptorEntry.index,
            descriptorEntry: newDescriptorEntry,
        };
        pool.push(entry);
    }

    entries.set(unmappedIndex, entry);
    return entry;
};

const remapInstructionReferences = (context: RemapContext, insn: Instruction): boolean => {
    const { pool } = context;

    let changed = false;
    switch (insn.opcode) {
        case Opcode.LDC:
        case Opcode.LDC_W:
        case Opcode.LDC2_W: {
            const constInsn = insn as ConstantInstruction;
            const poolEntry = pool[constInsn.index];

            let newEntry: Entry = poolEntry;
            switch (poolEntry.type) {
                case ConstantType.CLASS:
                    newEntry = remapClassEntry(context, poolEntry as ClassEntry);
                    break;
                case ConstantType.METHOD_HANDLE:
                    newEntry = remapHandleEntry(context, poolEntry as HandleEntry);
                    break;
                case ConstantType.DYNAMIC:
                    newEntry = remapDynamicEntry(context, poolEntry as DynamicEntry);
                    break;
                case ConstantType.METHOD_TYPE:
                    newEntry = remapMethodTypeEntry(context, poolEntry as MethodTypeEntry);
                    break;
            }

            if (newEntry !== poolEntry) {
                constInsn.index = newEntry.index;
                changed = true;
            }
            break;
        }

        case Opcode.GETSTATIC:
        case Opcode.PUTSTATIC:
        case Opcode.GETFIELD:
        case Opcode.PUTFIELD: {
            const fieldInsn = insn as LoadStoreInstruction;

            const poolEntry = pool[fieldInsn.index] as RefEntry;
            const newEntry = remapRefEntry(context, poolEntry);
            if (newEntry !== poolEntry) {
                fieldInsn.index = newEntry.index;
                changed = true;
            }
            break;
        }
        case Opcode.INVOKEVIRTUAL:
        case Opcode.INVOKESPECIAL:
        case Opcode.INVOKESTATIC:
        case Opcode.INVOKEINTERFACE: {
            const invokeInsn = insn as InvokeInstruction;

            const poolEntry = pool[invokeInsn.ref] as RefEntry;
            const newEntry = remapRefEntry(context, poolEntry);
            if (newEntry !== poolEntry) {
                invokeInsn.ref = newEntry.index;
                changed = true;
            }
            break;
        }

        case Opcode.INVOKEDYNAMIC: {
            const invokeInsn = insn as InvokeInstruction;

            const poolEntry = pool[invokeInsn.ref] as DynamicEntry;
            const newEntry = remapDynamicEntry(context, poolEntry);
            if (newEntry !== poolEntry) {
                invokeInsn.ref = newEntry.index;
                changed = true;
            }
            break;
        }

        case Opcode.NEW:
        case Opcode.CHECKCAST:
        case Opcode.INSTANCEOF: {
            const typeInsn = insn as TypeInstruction;

            const poolEntry = pool[typeInsn.index] as ClassEntry;
            const newEntry = remapClassEntry(context, poolEntry);
            if (newEntry !== poolEntry) {
                typeInsn.index = newEntry.index;
                changed = true;
            }
            break;
        }

        case Opcode.ANEWARRAY:
        case Opcode.MULTIANEWARRAY:
            const arrayInsn = insn as ArrayInstruction;

            const poolEntry = pool[arrayInsn.type] as ClassEntry;
            const newEntry = remapClassEntry(context, poolEntry);
            if (newEntry !== poolEntry) {
                arrayInsn.type = newEntry.index;
                changed = true;
            }
            break;
    }

    return changed;
};

const remapElementValue = (context: RemapContext, value: ElementValue): boolean => {
    const { pool, remapper } = context;
    let changed = false;

    switch (value.tag) {
        case ElementTag.CLASS: {
            const classValue = value as ClassElementValue;
            const classInfoEntry = classValue.classInfoEntry;
            const newEntry = remapUtf8Entry(context, classInfoEntry);
            if (newEntry !== classInfoEntry) {
                classValue.classInfoEntry = newEntry;
                changed = true;
            }
            break;
        }

        case ElementTag.ANNOTATION: {
            const annotationValue = value as AnnotationElementValue;
            if (remapAnnotation(context, annotationValue.annotation)) {
                changed = true;
            }
            break;
        }

        case ElementTag.ARRAY: {
            const arrayValue = value as ArrayElementValue;
            for (const elem of arrayValue.values) {
                if (remapElementValue(context, elem)) {
                    changed = true;
                }
            }
            break;
        }

        case ElementTag.ENUM: {
            const enumValue = value as EnumElementValue;
            const typeNameEntry = enumValue.typeNameEntry;
            const parsedTypeName = parseType(typeNameEntry.string);
            const newTypeNameEntry = remapUtf8Entry(context, typeNameEntry);
            if (newTypeNameEntry !== typeNameEntry) {
                enumValue.typeNameEntry = newTypeNameEntry;
                changed = true;
            }

            const constNameEntry = enumValue.constNameEntry;
            const newConstName = remapper.ref(parsedTypeName, constNameEntry.string, parsedTypeName);
            if (newConstName !== constNameEntry.string) {
                const newConstNameEntry: UTF8Entry = {
                    ...constNameEntry,
                    index: pool.length,
                    string: newConstName,
                    dirty: true,
                };
                pool.push(newConstNameEntry);
                enumValue.constNameEntry = newConstNameEntry;
                changed = true;
            }
            break;
        }
    }

    return changed;
};

const remapAnnotation = (context: RemapContext, annotation: Annotation): boolean => {
    const { pool, remapper } = context;
    let changed = false;

    const typeEntry = annotation.typeEntry;
    const parsedType = parseType(typeEntry.string);
    const newTypeEntry = remapUtf8Entry(context, typeEntry);
    if (newTypeEntry !== typeEntry) {
        annotation.typeEntry = newTypeEntry;
        changed = true;
    }

    for (const pair of annotation.values) {
        const nameEntry = pair.nameEntry;
        const valueType = typeOfElementValue(pair.value);
        const newName = remapper.ref(parsedType, nameEntry.string, valueType);
        if (newName !== nameEntry.string) {
            const newNameEntry: UTF8Entry = {
                ...nameEntry,
                index: pool.length,
                string: newName,
                dirty: true,
            };

            pool.push(newNameEntry);
            pair.nameEntry = newNameEntry;
            changed = true;
        }

        if (remapElementValue(context, pair.value)) {
            changed = true;
        }
    }

    return changed;
};

const remapAttribute = (context: RemapContext, owner: Type, attr: Attribute): void => {
    const { pool, remapper } = context;

    let changed = false;
    switch (attr.type) {
        case AttributeType.SIGNATURE: {
            const sigAttr = attr as SignatureAttribute;
            const newEntry = remapUtf8Entry(context, sigAttr.signatureEntry);
            if (newEntry !== sigAttr.signatureEntry) {
                sigAttr.signatureEntry = newEntry;
                changed = true;
            }
            break;
        }

        case AttributeType.EXCEPTIONS: {
            const excAttr = attr as ExceptionsAttribute;
            for (const excEntry of excAttr.entries) {
                const newEntry = remapClassEntry(context, excEntry.entry);
                if (newEntry !== excEntry.entry) {
                    excEntry.entry = newEntry;
                    changed = true;
                }
            }
            break;
        }

        case AttributeType.INNER_CLASSES: {
            const icAttr = attr as InnerClassesAttribute;
            for (const innerClass of icAttr.classes) {
                const newInnerEntry = remapClassEntry(context, innerClass.innerEntry);
                if (newInnerEntry !== innerClass.innerEntry) {
                    innerClass.innerEntry = newInnerEntry;
                    changed = true;

                    if (innerClass.innerNameEntry) {
                        const fqName = newInnerEntry.nameEntry.string;
                        const simpleName = fqName.includes("$")
                            ? fqName.substring(fqName.lastIndexOf("$") + 1)
                            : fqName;

                        if (simpleName !== innerClass.innerNameEntry.string) {
                            const newInnerNameEntry: UTF8Entry = {
                                ...innerClass.innerNameEntry,
                                index: pool.length,
                                string: simpleName,
                                dirty: true,
                            };
                            pool.push(newInnerNameEntry);
                            innerClass.innerNameEntry = newInnerNameEntry;
                        }
                    }
                }

                if (innerClass.outerEntry) {
                    const newOuterEntry = remapClassEntry(context, innerClass.outerEntry);
                    if (newOuterEntry !== innerClass.outerEntry) {
                        innerClass.outerEntry = newOuterEntry;
                        changed = true;
                    }
                }
            }
            break;
        }

        case AttributeType.BOOTSTRAP_METHODS: {
            const bsmAttr = attr as BootstrapMethodsAttribute;
            for (const method of bsmAttr.methods) {
                const newEntry = remapHandleEntry(context, method.refEntry);
                if (newEntry !== method.refEntry) {
                    method.refEntry = newEntry;
                    changed = true;
                }
            }
            break;
        }

        case AttributeType.RECORD: {
            const recAttr = attr as RecordAttribute;
            for (const component of recAttr.components) {
                const descriptorType = parseType(component.descriptorEntry.string);
                const remappedName = remapper.ref(owner, component.nameEntry.string, descriptorType);

                if (remappedName !== component.nameEntry.string) {
                    const newNameEntry: UTF8Entry = {
                        ...component.nameEntry,
                        index: pool.length,
                        string: remappedName,
                        dirty: true,
                    };
                    pool.push(newNameEntry);
                    component.nameEntry = newNameEntry;
                    changed = true;
                }

                const newEntry = remapUtf8Entry(context, component.descriptorEntry);
                if (newEntry !== component.descriptorEntry) {
                    component.descriptorEntry = newEntry;
                    changed = true;
                }

                for (const compAttr of component.attrs) {
                    remapAttribute(context, owner, compAttr);
                    if (compAttr.dirty) {
                        changed = true;
                    }
                }
            }
            break;
        }

        case AttributeType.PERMITTED_SUBCLASSES: {
            const psAttr = attr as PermittedSubclassesAttribute;
            for (const clazz of psAttr.classes) {
                const newEntry = remapClassEntry(context, clazz.entry);
                if (newEntry !== clazz.entry) {
                    clazz.entry = newEntry;
                    changed = true;
                }
            }
            break;
        }

        case AttributeType.NEST_HOST: {
            const nhAttr = attr as NestHostAttribute;
            const newEntry = remapClassEntry(context, nhAttr.hostClassEntry);
            if (newEntry !== nhAttr.hostClassEntry) {
                nhAttr.hostClassEntry = newEntry;
                changed = true;
            }
            break;
        }

        case AttributeType.NEST_MEMBERS: {
            const nmAttr = attr as NestMembersAttribute;
            for (const member of nmAttr.classes) {
                const newEntry = remapClassEntry(context, member.entry);
                if (newEntry !== member.entry) {
                    member.entry = newEntry;
                    changed = true;
                }
            }
            break;
        }

        case AttributeType.ENCLOSING_METHOD: {
            const emAttr = attr as EnclosingMethodAttribute;
            const ownerType = parseType(`L${emAttr.classEntry.nameEntry.string};`);
            const newMethodEntry = remapNameTypeEntry(context, emAttr.methodEntry, ownerType);
            if (newMethodEntry !== emAttr.methodEntry) {
                emAttr.methodEntry = newMethodEntry;
                changed = true;
            }

            const newClassEntry = remapClassEntry(context, emAttr.classEntry);
            if (newClassEntry !== emAttr.classEntry) {
                emAttr.classEntry = newClassEntry;
                changed = true;
            }
            break;
        }

        case AttributeType.LOCAL_VARIABLE_TABLE:
        case AttributeType.LOCAL_VARIABLE_TYPE_TABLE: {
            const lvtAttr = attr as LocalVariableTableAttribute;
            for (const entry of lvtAttr.entries) {
                const newEntry = remapUtf8Entry(context, entry.descriptorEntry);
                if (newEntry !== entry.descriptorEntry) {
                    entry.descriptorEntry = newEntry;
                    changed = true;
                }
            }
            break;
        }

        case AttributeType.CODE: {
            const codeAttr = attr as CodeAttribute;
            for (const exception of codeAttr.exceptionTable) {
                if (exception.catchType !== 0) {
                    const classEntry = pool[exception.catchType] as ClassEntry;
                    const newEntry = remapClassEntry(context, classEntry);
                    if (newEntry !== classEntry) {
                        exception.catchType = newEntry.index;
                        changed = true;
                    }
                }
            }

            for (const insn of codeAttr.insns) {
                if (remapInstructionReferences(context, insn)) {
                    changed = true;
                }
            }

            for (const nestedAttr of codeAttr.attrs) {
                remapAttribute(context, owner, nestedAttr);
                if (nestedAttr.dirty) {
                    changed = true;
                }
            }
            break;
        }

        case AttributeType.MODULE: {
            const modAttr = attr as ModuleAttribute;
            for (const use of modAttr.uses) {
                const newEntry = remapClassEntry(context, use.entry);
                if (newEntry !== use.entry) {
                    use.entry = newEntry;
                    changed = true;
                }
            }
            for (const provide of modAttr.provides) {
                const newEntry = remapClassEntry(context, provide.entry);
                if (newEntry !== provide.entry) {
                    provide.entry = newEntry;
                    changed = true;
                }

                for (const withElement of provide.with) {
                    const newWithEntry = remapClassEntry(context, withElement.entry);
                    if (newWithEntry !== withElement.entry) {
                        withElement.entry = newWithEntry;
                        changed = true;
                    }
                }
            }
            break;
        }

        case AttributeType.MODULE_MAIN_CLASS: {
            const mmcAttr = attr as ModuleMainClassAttribute;
            const newEntry = remapClassEntry(context, mmcAttr.mainClassEntry!);
            if (newEntry !== mmcAttr.mainClassEntry) {
                mmcAttr.mainClassEntry = newEntry;
                changed = true;
            }
            break;
        }

        case AttributeType.RUNTIME_VISIBLE_ANNOTATIONS:
        case AttributeType.RUNTIME_INVISIBLE_ANNOTATIONS: {
            const annAttr = attr as AnnotationsAttribute;
            for (const annotation of annAttr.annotations) {
                if (remapAnnotation(context, annotation)) {
                    changed = true;
                }
            }
            break;
        }

        case AttributeType.RUNTIME_VISIBLE_PARAMETER_ANNOTATIONS:
        case AttributeType.RUNTIME_INVISIBLE_PARAMETER_ANNOTATIONS: {
            const paAttr = attr as ParameterAnnotationsAttribute;
            for (const parameter of paAttr.parameters) {
                for (const annotation of parameter) {
                    if (remapAnnotation(context, annotation)) {
                        changed = true;
                    }
                }
            }
            break;
        }
    }

    if (changed) {
        attr.dirty = true;
    }
};

const remapMember = (context: RemapContext, owner: Type, member: Member) => {
    const { pool, remapper } = context;

    const memberType = parseType(member.type.string);
    const remappedName = remapper.ref(owner, member.name.string, memberType);
    if (remappedName !== member.name.string) {
        const newNameEntry: UTF8Entry = {
            ...member.name,
            index: pool.length,
            string: remappedName,
            dirty: true,
        };
        pool.push(newNameEntry);
        member.name = newNameEntry;
    }

    member.type = remapUtf8Entry(context, member.type);
    for (const attr of member.attrs) {
        remapAttribute(context, owner, attr);
    }
};

// modified in-place
export const remap = (node: Node, remapper: Remapper) => {
    const context = createContext(node, remapper);

    const ownerType = parseType(`L${node.thisClass.nameEntry.string};`);
    node.thisClass = remapClassEntry(context, node.thisClass);

    if (node.superClass) {
        node.superClass = remapClassEntry(context, node.superClass);
    }

    for (let i = 0; i < node.interfaces.length; i++) {
        node.interfaces[i] = remapClassEntry(context, node.interfaces[i]);
    }

    for (const member of [...node.fields, ...node.methods]) {
        remapMember(context, ownerType, member);
    }

    for (const attr of node.attrs) {
        remapAttribute(context, ownerType, attr);
    }
};
