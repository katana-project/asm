import type { DirtyMarkable, Node } from "../";
import type {
    Attributable,
    Attribute,
    BootstrapMethodsAttribute,
    CodeAttribute,
    ConstantValueAttribute,
    ExceptionsAttribute,
    InnerClassesAttribute,
    LocalVariableTableAttribute,
    NestHostAttribute,
    NestMembersAttribute,
    PermittedSubclassesAttribute,
    RecordAttribute,
    SignatureAttribute,
    SourceFileAttribute,
} from "../attr";
import type { ConstantInstruction } from "../insn";
import type { Pool } from "../pool";
import { AttributeType, ConstantType, Modifier, Opcode } from "../spec";

const enum AttributeContext {
    NONE = 0,
    CLASS = 1 << 0,
    FIELD = 1 << 1,
    METHOD = 1 << 2,
    RECORD_COMPONENT = 1 << 3,
    ATTRIBUTE = 1 << 4,
}

const getAllowedContext = (attr: Attribute): AttributeContext => {
    if (!attr.name) {
        return AttributeContext.NONE;
    }

    switch (attr.name.string) {
        case AttributeType.BOOTSTRAP_METHODS:
        case AttributeType.ENCLOSING_METHOD:
        case AttributeType.INNER_CLASSES:
        case AttributeType.MODULE:
        case AttributeType.MODULE_MAIN_CLASS:
        case AttributeType.MODULE_PACKAGES:
        case AttributeType.NEST_HOST:
        case AttributeType.NEST_MEMBERS:
        case AttributeType.PERMITTED_SUBCLASSES:
        case AttributeType.RECORD:
        case AttributeType.SOURCE_DEBUG_EXTENSION:
        case AttributeType.SOURCE_FILE:
            return AttributeContext.CLASS;
        case AttributeType.CONSTANT_VALUE:
            return AttributeContext.FIELD;
        case AttributeType.ANNOTATION_DEFAULT:
        case AttributeType.CODE:
        case AttributeType.EXCEPTIONS:
        case AttributeType.METHOD_PARAMETERS:
        case AttributeType.RUNTIME_INVISIBLE_PARAMETER_ANNOTATIONS:
        case AttributeType.RUNTIME_VISIBLE_PARAMETER_ANNOTATIONS:
            return AttributeContext.METHOD;
        case AttributeType.DEPRECATED:
        case AttributeType.SYNTHETIC:
            return AttributeContext.CLASS | AttributeContext.FIELD | AttributeContext.METHOD;
        case AttributeType.LINE_NUMBER_TABLE:
        case AttributeType.LOCAL_VARIABLE_TABLE:
        case AttributeType.LOCAL_VARIABLE_TYPE_TABLE:
        case AttributeType.STACK_MAP_TABLE:
            return AttributeContext.ATTRIBUTE;
    }

    // all are allowed by default
    return (
        AttributeContext.CLASS |
        AttributeContext.FIELD |
        AttributeContext.METHOD |
        AttributeContext.RECORD_COMPONENT |
        AttributeContext.ATTRIBUTE
    );
};

const checkPoolAccess = (attr: Attribute, pool: Pool): boolean => {
    switch (attr.type) {
        case AttributeType.CODE:
            return (attr as CodeAttribute).exceptionTable
                .filter((e) => e.catchType !== 0)
                .every((e) => pool[e.catchType]?.type === ConstantType.CLASS);
        case AttributeType.SOURCE_FILE:
            return (attr as SourceFileAttribute).sourceFileEntry?.type === ConstantType.UTF8;
        case AttributeType.SIGNATURE:
            return (attr as SignatureAttribute).signatureEntry?.type === ConstantType.UTF8;
        case AttributeType.LOCAL_VARIABLE_TABLE:
            return (attr as LocalVariableTableAttribute).entries.every(
                (e) => e.nameEntry?.type === ConstantType.UTF8 && e.descriptorEntry?.type === ConstantType.UTF8
            );
        case AttributeType.EXCEPTIONS:
            return (attr as ExceptionsAttribute).entries.every((e) => e.entry?.type === ConstantType.CLASS);
        case AttributeType.CONSTANT_VALUE:
            const entry = (attr as ConstantValueAttribute).constEntry;
            return (
                entry !== undefined &&
                ((entry.type >= ConstantType.INTEGER && entry.type <= ConstantType.DOUBLE) ||
                    entry.type === ConstantType.STRING)
            );
        case AttributeType.BOOTSTRAP_METHODS:
            return (attr as BootstrapMethodsAttribute).methods.every(
                (m) =>
                    m.refEntry?.type === ConstantType.METHOD_HANDLE &&
                    m.args.every(({ entry }) => {
                        const t = entry?.type;

                        return (
                            entry !== undefined &&
                            ((t >= ConstantType.INTEGER && t <= ConstantType.STRING) ||
                                (t >= ConstantType.METHOD_HANDLE && t <= ConstantType.DYNAMIC))
                        );
                    })
            );
        case AttributeType.RECORD:
            return (attr as RecordAttribute).components.every(
                (c) => c.nameEntry?.type === ConstantType.UTF8 && c.descriptorEntry?.type === ConstantType.UTF8
            );
        case AttributeType.PERMITTED_SUBCLASSES:
            return (attr as PermittedSubclassesAttribute).classes.every((c) => c.entry?.type === ConstantType.CLASS);
        case AttributeType.NEST_HOST:
            return (attr as NestHostAttribute).hostClassEntry?.type === ConstantType.CLASS;
        case AttributeType.NEST_MEMBERS:
            return (attr as NestMembersAttribute).classes.every((c) => c.entry?.type === ConstantType.CLASS);
        case AttributeType.INNER_CLASSES:
            return (attr as InnerClassesAttribute).classes.every((c) => {
                return (
                    c.innerEntry?.type === ConstantType.CLASS &&
                    (c.outerEntry?.type ?? ConstantType.CLASS) === ConstantType.CLASS &&
                    (c.innerNameEntry?.type ?? ConstantType.UTF8) === ConstantType.UTF8
                );
            });
    }

    return true;
};

// attribute types that we can parse
// TODO: check against AttributeType after we can parse everything
const SUPPORTED_TYPES = new Set<string>([
    AttributeType.CODE,
    AttributeType.SOURCE_FILE,
    AttributeType.SIGNATURE,
    AttributeType.LOCAL_VARIABLE_TABLE,
    AttributeType.EXCEPTIONS,
    AttributeType.CONSTANT_VALUE,
    AttributeType.BOOTSTRAP_METHODS,
    AttributeType.RECORD,
    AttributeType.PERMITTED_SUBCLASSES,
    AttributeType.NEST_HOST,
    AttributeType.NEST_MEMBERS,
    AttributeType.INNER_CLASSES,
]);
const checkSingle = (attr: Attribute, pool: Pool, ctx: AttributeContext): boolean => {
    if ((getAllowedContext(attr) & ctx) === 0) {
        // attribute not allowed in context
        return false;
    }
    const name = attr.name!.string;
    if (name !== attr.type && SUPPORTED_TYPES.has(name)) {
        // failed to parse supported attribute
        return false;
    }
    if (!checkPoolAccess(attr, pool)) {
        // attribute has an invalid constant pool access
        return false;
    }

    return true;
};

const check = (attrib: Attributable, pool: Pool, ctx: AttributeContext): boolean => {
    let dirty = false;

    const valid = attrib.attrs.filter((a) => checkSingle(a, pool, ctx));
    if (attrib.attrs.length > valid.length) {
        dirty = true; // one or more attributes were removed, dirty
    }

    attrib.attrs = valid;

    // check nested attributes
    for (const attr of attrib.attrs) {
        if ("attrs" in attr && check(attr as Attributable, pool, AttributeContext.ATTRIBUTE)) {
            dirty = true; // a nested attribute is dirty, propagate
        }
    }

    if (dirty && "dirty" in attrib) {
        // mark ourselves as dirty
        (attrib as DirtyMarkable).dirty = true;
    }
    return dirty;
};

const filter = (attrib: Attributable, ...names: string[]): boolean => {
    const valid = attrib.attrs.filter((a) => !names.includes(a.name?.string));
    const dirty = attrib.attrs.length > valid.length;

    attrib.attrs = valid;
    return dirty;
};

// modified in-place
export const verify = (node: Node) => {
    check(node, node.pool, AttributeContext.CLASS);
    for (const field of node.fields) {
        check(field, node.pool, AttributeContext.FIELD);
    }

    let hasDynamic = false;
    for (const method of node.methods) {
        check(method, node.pool, AttributeContext.METHOD);
        if ((method.access & Modifier.ABSTRACT) > 0) {
            // Code attributes are not allowed on abstract methods
            filter(method, AttributeType.CODE);
        }

        hasDynamic =
            hasDynamic ||
            method.attrs.some(
                (a) =>
                    a.type === AttributeType.CODE &&
                    (a as CodeAttribute).insns.some((i) => {
                        if (i.opcode === Opcode.LDC || i.opcode === Opcode.LDC_W || i.opcode === Opcode.LDC2_W) {
                            const index = (i as ConstantInstruction).index;
                            const type = node.pool[index]?.type;

                            return type === ConstantType.INVOKE_DYNAMIC || type === ConstantType.DYNAMIC;
                        }

                        return i.opcode === Opcode.INVOKEDYNAMIC;
                    })
            );
    }

    // special case: RecordComponent is not Attributable, but holds them
    for (const attr of node.attrs) {
        if (attr.type !== AttributeType.RECORD) continue;

        const record = attr as RecordAttribute;
        if (record.components.some((c) => check(c, node.pool, AttributeContext.RECORD_COMPONENT))) {
            record.dirty = true;
        }
    }

    if (!hasDynamic) {
        // no InvokeDynamic/Dynamic constant pool entry usages detected, remove
        filter(node, AttributeType.BOOTSTRAP_METHODS);
    }
    if ((node.access & Modifier.MODULE) === 0) {
        // no module modifier, remove
        filter(node, AttributeType.MODULE, AttributeType.MODULE_PACKAGES, AttributeType.MODULE_MAIN_CLASS);
    }
};
