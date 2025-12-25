import type { Member, Node } from "../";
import type {
    Attribute,
    BootstrapMethod,
    BootstrapMethodsAttribute,
    CodeAttribute,
    EnclosingMethodAttribute,
    ExceptionsAttribute,
    InnerClassesAttribute,
    LocalVariableTableAttribute,
    NestHostAttribute,
    NestMembersAttribute,
    PermittedSubclassesAttribute,
    RecordAttribute,
    SignatureAttribute,
} from "../attr";
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
import { AttributeType, ConstantType, HandleKind, Opcode } from "../spec";
import { type Type, parseType } from "../type";

export interface Remapper {
    type(type: Type): Type;
    ref(owner: Type, name: string, type: Type): string;
}

const remapUtf8Entry = (pool: Pool, entry: UTF8Entry, remapper: Remapper): UTF8Entry => {
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

    return entry;
};

const remapClassEntry = (pool: Pool, entry: ClassEntry, remapper: Remapper): ClassEntry => {
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

    return entry;
};

const remapRefEntry = (pool: Pool, entry: RefEntry, remapper: Remapper): RefEntry => {
    const classEntry = entry.refEntry;
    const nameTypeEntry = entry.nameTypeEntry;
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

    const newClassEntry = remapClassEntry(pool, classEntry, remapper);
    if (newClassEntry !== classEntry || newNameEntry !== nameEntry || newTypeEntry !== typeEntry) {
        const newNameTypeEntry: NameTypeEntry = {
            ...nameTypeEntry,
            index: pool.length,
            name: newNameEntry.index,
            nameEntry: newNameEntry,
            type_: newTypeEntry.index,
            typeEntry: newTypeEntry,
        };
        pool.push(newNameTypeEntry);

        const newRefEntry: RefEntry = {
            ...entry,
            index: pool.length,
            ref: newClassEntry.index,
            refEntry: newClassEntry,
            nameType: newNameTypeEntry.index,
            nameTypeEntry: newNameTypeEntry,
        };
        pool.push(newRefEntry);

        return newRefEntry;
    }

    return entry;
};

const remapNameTypeEntry = (pool: Pool, entry: NameTypeEntry, remapper: Remapper, ownerType?: Type): NameTypeEntry => {
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

    return entry;
};

const remapHandleEntry = (pool: Pool, entry: HandleEntry, remapper: Remapper): HandleEntry => {
    const refEntry = entry.refEntry;
    const newRefEntry = remapRefEntry(pool, refEntry, remapper);
    if (newRefEntry !== refEntry) {
        entry = {
            ...entry,
            index: pool.length,
            ref: newRefEntry.index,
            refEntry: newRefEntry,
        };
        pool.push(entry);
    }

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

const remapDynamicEntry = (node: Node, entry: DynamicEntry, remapper: Remapper): DynamicEntry => {
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
                        ...(node.pool[nameTypeEntry.name] as UTF8Entry),
                        index: node.pool.length,
                        string: remappedName,
                        dirty: true,
                    };
                    node.pool.push(newNameEntry);

                    const newTypeEntry = remapUtf8Entry(
                        node.pool,
                        node.pool[nameTypeEntry.type_] as UTF8Entry,
                        remapper
                    );
                    newNameTypeEntry = {
                        ...nameTypeEntry,
                        index: node.pool.length,
                        name: newNameEntry.index,
                        nameEntry: newNameEntry,
                        type_: newTypeEntry.index,
                        typeEntry: newTypeEntry,
                    };
                    node.pool.push(newNameTypeEntry);
                }
            }
        }
    }

    if (newNameTypeEntry === null) {
        newNameTypeEntry = remapNameTypeEntry(node.pool, nameTypeEntry, remapper);
    }
    if (newNameTypeEntry !== nameTypeEntry) {
        entry = {
            ...entry,
            index: node.pool.length,
            nameType: newNameTypeEntry.index,
            nameTypeEntry: newNameTypeEntry,
        };
        node.pool.push(entry);
    }

    return entry;
};

const remapMethodTypeEntry = (pool: Pool, entry: MethodTypeEntry, remapper: Remapper): MethodTypeEntry => {
    const descriptorEntry = entry.descriptorEntry;
    const newDescriptorEntry = remapUtf8Entry(pool, descriptorEntry, remapper);
    if (newDescriptorEntry !== descriptorEntry) {
        entry = {
            ...entry,
            index: pool.length,
            descriptor: newDescriptorEntry.index,
            descriptorEntry: newDescriptorEntry,
        };
        pool.push(entry);
    }

    return entry;
};

const remapInstructionReferences = (node: Node, insn: Instruction, remapper: Remapper): boolean => {
    const { pool } = node;

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
                    newEntry = remapClassEntry(pool, poolEntry as ClassEntry, remapper);
                    break;
                case ConstantType.METHOD_HANDLE:
                    newEntry = remapHandleEntry(pool, poolEntry as HandleEntry, remapper);
                    break;
                case ConstantType.DYNAMIC:
                    newEntry = remapDynamicEntry(node, poolEntry as DynamicEntry, remapper);
                    break;
                case ConstantType.METHOD_TYPE:
                    newEntry = remapMethodTypeEntry(pool, poolEntry as MethodTypeEntry, remapper);
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
            const newEntry = remapRefEntry(pool, poolEntry, remapper);
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
            const newEntry = remapRefEntry(pool, poolEntry, remapper);
            if (newEntry !== poolEntry) {
                invokeInsn.ref = newEntry.index;
                changed = true;
            }
            break;
        }

        case Opcode.INVOKEDYNAMIC: {
            const invokeInsn = insn as InvokeInstruction;

            const poolEntry = pool[invokeInsn.ref] as DynamicEntry;
            const newEntry = remapDynamicEntry(node, poolEntry, remapper);
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
            const newEntry = remapClassEntry(pool, poolEntry, remapper);
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
            const newEntry = remapClassEntry(pool, poolEntry, remapper);
            if (newEntry !== poolEntry) {
                arrayInsn.type = newEntry.index;
                changed = true;
            }
            break;
    }

    return changed;
};

const remapAttribute = (node: Node, owner: Type, attr: Attribute, remapper: Remapper): void => {
    const { pool } = node;

    let changed = false;
    switch (attr.type) {
        case AttributeType.SIGNATURE: {
            const sigAttr = attr as SignatureAttribute;
            const newEntry = remapUtf8Entry(pool, sigAttr.signatureEntry, remapper);
            if (newEntry !== sigAttr.signatureEntry) {
                sigAttr.signatureEntry = newEntry;
                changed = true;
            }
            break;
        }

        case AttributeType.EXCEPTIONS: {
            const excAttr = attr as ExceptionsAttribute;
            for (const excEntry of excAttr.entries) {
                const newEntry = remapClassEntry(pool, excEntry.entry, remapper);
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
                const newInnerEntry = remapClassEntry(pool, innerClass.innerEntry, remapper);
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
                    const newOuterEntry = remapClassEntry(pool, innerClass.outerEntry, remapper);
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
                const newEntry = remapHandleEntry(pool, method.refEntry, remapper);
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

                const newEntry = remapUtf8Entry(pool, component.descriptorEntry, remapper);
                if (newEntry !== component.descriptorEntry) {
                    component.descriptorEntry = newEntry;
                    changed = true;
                }

                for (const compAttr of component.attrs) {
                    remapAttribute(node, owner, compAttr, remapper);
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
                const newEntry = remapClassEntry(pool, clazz.entry, remapper);
                if (newEntry !== clazz.entry) {
                    clazz.entry = newEntry;
                    changed = true;
                }
            }
            break;
        }

        case AttributeType.NEST_HOST: {
            const nhAttr = attr as NestHostAttribute;
            const newEntry = remapClassEntry(pool, nhAttr.hostClassEntry, remapper);
            if (newEntry !== nhAttr.hostClassEntry) {
                nhAttr.hostClassEntry = newEntry;
                changed = true;
            }
            break;
        }

        case AttributeType.NEST_MEMBERS: {
            const nmAttr = attr as NestMembersAttribute;
            for (const member of nmAttr.classes) {
                const newEntry = remapClassEntry(pool, member.entry, remapper);
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
            const newMethodEntry = remapNameTypeEntry(pool, emAttr.methodEntry, remapper, ownerType);
            if (newMethodEntry !== emAttr.methodEntry) {
                emAttr.methodEntry = newMethodEntry;
                changed = true;
            }

            const newClassEntry = remapClassEntry(pool, emAttr.classEntry, remapper);
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
                const newEntry = remapUtf8Entry(pool, entry.descriptorEntry, remapper);
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
                    const newEntry = remapClassEntry(pool, classEntry, remapper);
                    if (newEntry !== classEntry) {
                        exception.catchType = newEntry.index;
                        changed = true;
                    }
                }
            }

            for (const insn of codeAttr.insns) {
                if (remapInstructionReferences(node, insn, remapper)) {
                    changed = true;
                }
            }

            for (const nestedAttr of codeAttr.attrs) {
                remapAttribute(node, owner, nestedAttr, remapper);
                if (nestedAttr.dirty) {
                    changed = true;
                }
            }
            break;
        }
    }

    if (changed) {
        attr.dirty = true;
    }
};

const remapMember = (node: Node, owner: Type, member: Member, remapper: Remapper) => {
    const { pool } = node;

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

    member.type = remapUtf8Entry(pool, member.type, remapper);
    for (const attr of member.attrs) {
        remapAttribute(node, owner, attr, remapper);
    }
};

// modified in-place
export const remap = (node: Node, remapper: Remapper) => {
    const { pool } = node;

    const ownerType = parseType(`L${node.thisClass.nameEntry.string};`);
    node.thisClass = remapClassEntry(pool, node.thisClass, remapper);

    if (node.superClass) {
        node.superClass = remapClassEntry(pool, node.superClass, remapper);
    }

    for (let i = 0; i < node.interfaces.length; i++) {
        node.interfaces[i] = remapClassEntry(pool, node.interfaces[i], remapper);
    }

    for (const member of [...node.fields, ...node.methods]) {
        remapMember(node, ownerType, member, remapper);
    }

    for (const attr of node.attrs) {
        remapAttribute(node, ownerType, attr, remapper);
    }
};
