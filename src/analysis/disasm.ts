import type { Member, Node } from "../";
import type {
    Attributable,
    CodeAttribute,
    ConstantValueAttribute,
    ExceptionsAttribute,
    ExceptionTableEntry,
    SignatureAttribute,
    SourceFileAttribute,
} from "../attr";
import { findLocals, localSize } from "../attr/lvt";
import type {
    ArrayInstruction,
    BranchInstruction,
    ConstantInstruction,
    IncrementInstruction,
    Instruction,
    InvokeInstruction,
    LoadStoreInstruction,
    PushInstruction,
    SwitchInstruction,
    TypeInstruction,
    WideInstruction,
} from "../insn";
import { findSwitchValue } from "../insn/switch";
import type {
    ClassEntry,
    DynamicEntry,
    Entry,
    HandleEntry,
    MethodTypeEntry,
    ModularEntry,
    NameTypeEntry,
    NumericEntry,
    Pool,
    RefEntry,
    StringEntry,
    UTF8Entry,
} from "../pool";
import { ArrayCode, AttributeType, ConstantType, HandleKind, Modifier, Opcode } from "../spec";

export enum NodeType {
    CLASS = "class",
    ENUM = "enum",
    INTERFACE = "interface",
    ANNOTATION = "@interface",
    MODULE = "module",
}

export enum ElementType {
    CLASS,
    INTERFACE,
    CONSTRUCTOR,
    METHOD,
    FIELD,
    PARAMETER,
}

const modMasks: Record<ElementType, number> = {
    [ElementType.CLASS]: Modifier.PUBLIC | Modifier.ABSTRACT | Modifier.FINAL,
    [ElementType.INTERFACE]: Modifier.PUBLIC | Modifier.ABSTRACT,
    [ElementType.CONSTRUCTOR]: Modifier.PUBLIC | Modifier.PROTECTED | Modifier.PRIVATE,
    [ElementType.METHOD]:
        Modifier.PUBLIC |
        Modifier.PROTECTED |
        Modifier.PRIVATE |
        Modifier.ABSTRACT |
        Modifier.STATIC |
        Modifier.FINAL |
        Modifier.SYNCHRONIZED |
        Modifier.NATIVE |
        Modifier.STRICT,
    [ElementType.FIELD]:
        Modifier.PUBLIC |
        Modifier.PROTECTED |
        Modifier.PRIVATE |
        Modifier.STATIC |
        Modifier.FINAL |
        Modifier.TRANSIENT |
        Modifier.VOLATILE,
    [ElementType.PARAMETER]: Modifier.FINAL,
};

export const formatMod = (mod: number, element?: ElementType): string => {
    const uMod = mod; // unmasked
    mod = mod & (modMasks[element] ?? 0);

    let result = "";
    if ((mod & Modifier.PUBLIC) !== 0) result += "public ";
    if ((mod & Modifier.PRIVATE) !== 0) result += "private ";
    if ((mod & Modifier.PROTECTED) !== 0) result += "protected ";
    if ((mod & Modifier.STATIC) !== 0) result += "static ";
    if ((mod & Modifier.ABSTRACT) !== 0) result += "abstract ";
    if ((mod & Modifier.FINAL) !== 0) result += "final ";
    if ((mod & Modifier.NATIVE) !== 0) result += "native ";
    if ((mod & Modifier.STRICT) !== 0) result += "strict ";
    if ((mod & Modifier.SYNCHRONIZED) !== 0) result += "synchronized ";
    if ((mod & Modifier.TRANSIENT) !== 0) result += "transient ";
    if ((mod & Modifier.VOLATILE) !== 0) result += "volatile ";

    // unmasked modifier checks for non-Java modifiers
    if ((uMod & Modifier.SYNTHETIC) !== 0) result += "synthetic ";
    if (element === ElementType.CLASS || element === ElementType.INTERFACE) {
        // logical classes
        if ((uMod & Modifier.SUPER) !== 0) result += "super ";
    }
    if (element === ElementType.METHOD || element === ElementType.CONSTRUCTOR) {
        // logical methods
        if ((uMod & Modifier.BRIDGE) !== 0) result += "bridge ";
        if ((uMod & Modifier.VARARGS) !== 0) result += "varargs ";
    }

    return result;
};

const baseEscapes = new Map<string, string>(
    Object.entries({
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\",
        "'": "\\'",
    })
);

const literalEscapes = new Map<string, string>(
    Object.entries({
        " ": "\\u0020",
        ",": "\\u002C",
        ".": "\\u002E",
        ":": "\\u003A",
        "{": "\\u007B",
        "}": "\\u007D",
        '"': "\\u0022",
        "'": "\\u0027",
    })
);

const literalUnicodeEscapeRanges: { start: number; end: number }[] = [
    { start: 0x0000, end: 0x001f },
    { start: 0x007f, end: 0x009f },
    { start: 0x06e5, end: 0x06e5 },
    { start: 0x17b4, end: 0x17b4 },
    { start: 0x180b, end: 0x180e },
    { start: 0x2000, end: 0x200e },
    { start: 0x2028, end: 0x202e },
    { start: 0x205f, end: 0x206e },
    { start: 0x2400, end: 0x243e },
    { start: 0xe000, end: 0xf8ff },
    { start: 0xfe00, end: 0xfe0f },
    { start: 0xfe1a, end: 0xfe20 },
    { start: 0xfff0, end: 0xffff },
];

for (const range of literalUnicodeEscapeRanges) {
    for (let i = range.start; i <= range.end; i++) {
        baseEscapes.set(String.fromCharCode(i), `\\u${i.toString(16).toUpperCase().padStart(4, "0")}`);
    }
}

for (const [key, value] of baseEscapes.entries()) {
    literalEscapes.set(key, value);
}

export const escapeString = (s?: string): string => {
    if (!s) return "";

    return Array.from(s)
        .map((c) => baseEscapes.get(c) ?? c)
        .join("");
};

export const escapeLiteral = (s?: string): string => {
    if (!s) return "";

    return Array.from(s)
        .map((c) => literalEscapes.get(c) ?? c)
        .join("");
};

export const formatEntry = (entry: Entry, pool: Pool): string => {
    switch (entry.type) {
        case ConstantType.UTF8:
            return (entry as UTF8Entry).string;
        case ConstantType.INTEGER:
        case ConstantType.FLOAT:
        case ConstantType.LONG:
        case ConstantType.DOUBLE:
            return (entry as NumericEntry<any>).value.toString();
        case ConstantType.CLASS:
            return escapeLiteral(formatEntry((entry as ClassEntry).nameEntry, pool));
        case ConstantType.STRING:
            return `"${escapeString(formatEntry((entry as StringEntry).dataEntry, pool))}"`;
        case ConstantType.METHOD_TYPE:
            return formatEntry((entry as MethodTypeEntry).descriptorEntry, pool);
        case ConstantType.MODULE:
            return escapeString(formatEntry((entry as ModularEntry).nameEntry, pool));
        case ConstantType.PACKAGE:
            return escapeLiteral(formatEntry((entry as ModularEntry).nameEntry, pool));
        case ConstantType.FIELDREF:
        case ConstantType.METHODREF:
        case ConstantType.INTERFACE_METHODREF: {
            const refEntry = entry as RefEntry;

            return `${formatEntry(refEntry.refEntry, pool)} ${formatEntry(refEntry.nameTypeEntry, pool)}`;
        }
        case ConstantType.NAME_AND_TYPE: {
            const ntEntry = entry as NameTypeEntry;

            return `${escapeLiteral(ntEntry.nameEntry.string)} ${escapeLiteral(ntEntry.typeEntry.string)}`;
        }
        case ConstantType.DYNAMIC:
        case ConstantType.INVOKE_DYNAMIC: {
            const dynEntry = entry as DynamicEntry;

            return `${dynEntry.bsmIndex} ${formatEntry(dynEntry.nameTypeEntry, pool)}`;
        }
        case ConstantType.METHOD_HANDLE:
            const handleEntry = entry as HandleEntry;

            return `${HandleKind[handleEntry.kind].toLowerCase()} ${formatEntry(handleEntry.refEntry, pool)}`;
        default:
            throw new Error("Unrecognized constant pool tag " + entry.type);
    }
};

const formatLoadStore = (code: CodeAttribute, insn: Instruction, index: number): string => {
    const local = findLocals(code, insn.offset + insn.length /* occupied on next instruction */).find(
        (l) => l.index === index
    );

    return local
        ? `${escapeLiteral(local.nameEntry?.string)} ${escapeLiteral(local.descriptorEntry?.string)}`
        : index.toString();
};

export const formatInsn = (
    code: CodeAttribute,
    insn: Instruction,
    pool: Pool,
    branchOffsets: boolean = true
): string => {
    const mnemonic = Opcode[insn.opcode]?.toLowerCase();

    let value = mnemonic || "<unknown opcode>";
    switch (insn.opcode) {
        case Opcode.ALOAD:
        case Opcode.ASTORE:
        case Opcode.DLOAD:
        case Opcode.DSTORE:
        case Opcode.FLOAD:
        case Opcode.FSTORE:
        case Opcode.ILOAD:
        case Opcode.ISTORE:
        case Opcode.LLOAD:
        case Opcode.LSTORE:
        case Opcode.RET:
            value += ` ${formatLoadStore(code, insn, (insn as LoadStoreInstruction).index)}`;
            break;
        case Opcode.GETFIELD:
        case Opcode.GETSTATIC:
        case Opcode.PUTFIELD:
        case Opcode.PUTSTATIC:
            value += ` ${formatEntry(pool[(insn as LoadStoreInstruction).index]!, pool)}`;
            break;
        case Opcode.IINC: {
            const iincInsn = insn as IncrementInstruction;

            value += ` ${formatLoadStore(code, insn, iincInsn.index)} ${iincInsn.const}`;
            break;
        }
        case Opcode.WIDE:
            value += ` ${formatInsn(code, (insn as WideInstruction).insn, pool)}`;
            break;
        case Opcode.INVOKEDYNAMIC:
        case Opcode.INVOKEINTERFACE:
        case Opcode.INVOKESPECIAL:
        case Opcode.INVOKESTATIC:
        case Opcode.INVOKEVIRTUAL:
            value += ` ${formatEntry(pool[(insn as InvokeInstruction).ref]!, pool)}`;
            break;
        case Opcode.LDC:
        case Opcode.LDC_W:
        case Opcode.LDC2_W:
            value += ` ${formatEntry(pool[(insn as ConstantInstruction).index]!, pool)}`;
            break;
        case Opcode.CHECKCAST:
        case Opcode.INSTANCEOF:
        case Opcode.NEW:
            value += ` ${formatEntry(pool[(insn as TypeInstruction).index]!, pool)}`;
            break;
        case Opcode.BIPUSH:
        case Opcode.SIPUSH:
            value += ` ${(insn as PushInstruction).value}`;
            break;
        case Opcode.ANEWARRAY:
        case Opcode.NEWARRAY:
        case Opcode.MULTIANEWARRAY: {
            const arrayInsn = insn as ArrayInstruction;
            const arrayCode = ArrayCode[arrayInsn.type];

            value += ` ${arrayCode ? arrayCode.substring(2).toLowerCase() : formatEntry(pool[arrayInsn.type]!, pool)}`;
            if (arrayInsn.opcode === Opcode.MULTIANEWARRAY) {
                value += ` ${arrayInsn.dimensions}`;
            }
            break;
        }
    }

    const lsMatch = mnemonic?.match(/^([adfil](?:load|store))_([0-3])$/);
    if (lsMatch) {
        const formatted = formatLoadStore(code, insn, parseInt(lsMatch[2], 10));

        // skip repeating index when no local is found
        if (formatted !== lsMatch[2]) {
            value = `${lsMatch[1]} ${formatted}`;
        }
    }

    if (branchOffsets) {
        switch (insn.opcode) {
            case Opcode.TABLESWITCH:
            case Opcode.LOOKUPSWITCH: {
                const { defaultOffset, jumpOffsets } = insn as SwitchInstruction;

                value += ` default->${insn.offset + defaultOffset}`;
                if (jumpOffsets.length > 0) {
                    value += ` ${jumpOffsets.map((o, i) => `${findSwitchValue(insn as SwitchInstruction, i)}->${insn.offset + o}`).join(" ")}`;
                }
                break;
            }
            case Opcode.GOTO:
            case Opcode.GOTO_W:
            case Opcode.IFEQ:
            case Opcode.IFNE:
            case Opcode.IFLT:
            case Opcode.IFGE:
            case Opcode.IFGT:
            case Opcode.IFLE:
            case Opcode.IF_ICMPEQ:
            case Opcode.IF_ICMPNE:
            case Opcode.IF_ICMPLT:
            case Opcode.IF_ICMPGE:
            case Opcode.IF_ICMPGT:
            case Opcode.IF_ICMPLE:
            case Opcode.IF_ACMPEQ:
            case Opcode.IF_ACMPNE:
            case Opcode.JSR:
            case Opcode.JSR_W:
            case Opcode.IFNULL:
            case Opcode.IFNONNULL:
                value += ` ${insn.offset + (insn as BranchInstruction).branchOffset}`;
                break;
        }
    }

    return value;
};

interface ReferenceHolder {
    name(fqName: string): string;
    refs(): string[];
}

const emptyRefHolder: ReferenceHolder = {
    name(fqName: string): string {
        return escapeLiteral(fqName).replaceAll("/", ".");
    },
    refs(): string[] {
        return [];
    },
};

const createRefHolder = (): ReferenceHolder => {
    const refs = new Map<string, string>();

    return {
        name(fqName: string): string {
            fqName = escapeLiteral(fqName).replaceAll("/", ".");

            const index = fqName.lastIndexOf(".");
            if (index === -1) {
                return fqName; // default package
            }

            const simpleName = fqName.substring(index + 1);

            const existingName = refs.get(simpleName);
            if (existingName) {
                if (existingName !== fqName) {
                    return fqName; // conflict, use fully qualified name
                }

                // entry found
                return simpleName;
            }

            // no conflict and no entry
            refs.set(simpleName, fqName);
            return simpleName;
        },
        refs(): string[] {
            return Array.from(refs.values());
        },
    };
};

const primTypes: Record<string, string> = {
    B: "byte",
    C: "char",
    D: "double",
    F: "float",
    I: "int",
    J: "long",
    S: "short",
    Z: "boolean",
    V: "void",
};

const formatDesc = (desc: string, refHolder: ReferenceHolder): string => {
    if (!desc) {
        return desc;
    }

    switch (desc[0]) {
        case "[":
            return `${formatDesc(desc.substring(1), refHolder)}[]`;
        case "L":
            return refHolder.name(desc.substring(1, desc.length - 1));
    }
    return primTypes[desc] || desc.replaceAll("/", ".");
};

const splitDescs = (descs: string): string[] => {
    const args: string[] = [];
    for (let i = 0; i < descs.length; i++) {
        const char = descs.charAt(i);

        const start = i;
        switch (char) {
            case "L": {
                i = descs.indexOf(";", i);
                args.push(descs.substring(start, i + 1));
                break;
            }
            case "[": {
                while (descs.charAt(i) === "[") {
                    i++;
                }
                if (descs.charAt(i) === "L") {
                    i = descs.indexOf(";", i);
                }

                args.push(descs.substring(start, i + 1));
                break;
            }
            default: {
                args.push(char);
                break;
            }
        }
    }

    return args;
};

const block = (s: string, indent: string): string => s.replaceAll(/^(?!\s*$)/gm, indent);

const EXCLUDED_ATTRS = new Set<string>([
    AttributeType.CODE,
    AttributeType.SOURCE_FILE,
    AttributeType.SIGNATURE,
    AttributeType.EXCEPTIONS,
    AttributeType.CONSTANT_VALUE,
    AttributeType.DEPRECATED,
]);
const disassembleAttrs = (attrib: Attributable): string => {
    let result = "";
    for (const attr of attrib.attrs) {
        if (EXCLUDED_ATTRS.has(attr.name.string)) {
            continue; // skip attributes represented in a different way
        }

        result += `// ${attr.name.string} (${attr.data.length}): `;
        if (!attr.type) {
            result += `(not supported)\n`;
        } else {
            // erase generic attribute fields
            result += `${JSON.stringify({ ...attr, type: undefined, data: undefined, name: undefined, nameIndex: undefined, dirty: undefined })}\n`;
        }
    }

    return result;
};

const disassembleAnnos = (attrib: Attributable, refHolder: ReferenceHolder): string => {
    let result = "";
    if (attrib.attrs.some((a) => a.type === AttributeType.DEPRECATED)) {
        result += `@${refHolder.name("java/lang/Deprecated")}\n`;
    }

    return result;
};

const disassembleCode = (code: CodeAttribute, pool: Pool, indent: string, refHolder: ReferenceHolder): string => {
    const padding = code.insns[code.insns.length - 1].offset.toString().length;
    let level = 0;

    let result = "";
    const excHandlers = (entries: { entry: ExceptionTableEntry; index: number; start: boolean }[]) => {
        for (const { index, entry, start } of entries) {
            if (start) {
                result += `${indent.repeat(level)}try {\n`;
                level++;
            } else {
                level--;
                result += `${indent.repeat(level)}} catch (`;
                if (entry.catchType === 0) {
                    result += `${refHolder.name("java/lang/Throwable")} /* 0 */`;
                } else {
                    result += refHolder.name((pool[entry.catchType] as ClassEntry).nameEntry.string);
                }
                result += ` exc${index}) {\n${indent.repeat(level + 1)}/* goto ${entry.handlerPC} */\n${indent.repeat(level)}}\n`;
            }
        }
    };

    for (const insn of code.insns) {
        excHandlers(
            code.exceptionTable
                .map((entry, index) => ({ entry, index, start: entry.startPC === insn.offset }))
                .filter(({ entry, start }) => start || entry.endPC === insn.offset)
                .sort(({ start }) => (start ? 1 : -1))
        );

        result += `${indent.repeat(level)}// ${insn.offset.toString().padStart(padding, " ")}: ${formatInsn(code, insn, pool)}\n`;
    }

    const lastInsn = code.insns[code.insns.length - 1];
    // close pending handlers
    excHandlers(
        code.exceptionTable
            .map((entry, index) => ({ entry, index, start: false }))
            .filter(({ entry }) => entry.endPC >= lastInsn.offset + lastInsn.length)
    );

    return result;
};

const disassembleMethod0 = (
    node: Node,
    method: Member,
    indent: string,
    verbose: boolean,
    refHolder: ReferenceHolder,
    writeRefs: boolean
): string => {
    let result = "";

    const signature = method.attrs.find((a) => a.type === AttributeType.SIGNATURE);
    if (signature) {
        result += `// Signature: ${escapeString((signature as SignatureAttribute).signatureEntry?.string)}\n`;
    }

    if (verbose) {
        result += disassembleAttrs(method);
    }

    const code = method.attrs.find((a) => a.type === AttributeType.CODE) as CodeAttribute;
    if (code) {
        result += `// max stack: ${code.maxStack}, max locals: ${code.maxLocals}\n`;
    }

    const isStatic = (method.access & Modifier.STATIC) !== 0;

    let name = method.name.string;
    if (name === "<clinit>" && isStatic) {
        result += "static"; // static initializer
    } else {
        const isConstructor = name === "<init>";

        result += disassembleAnnos(method, refHolder);
        result += formatMod(method.access, isConstructor ? ElementType.CONSTRUCTOR : ElementType.METHOD);

        const [args, returnType] = method.type.string.substring(1).split(")", 2);
        if (isConstructor) {
            const nodeName = node.thisClass.nameEntry.string;
            refHolder.name(nodeName); // reserve name

            name = nodeName.substring(nodeName.lastIndexOf("/") + 1);
        } else {
            result += `${formatDesc(returnType, refHolder)} `;
        }

        const locals = code ? findLocals(code, 0) : [];
        let localIndex = isStatic ? 0 : 1;

        result += `${escapeLiteral(name)}(`;
        result += splitDescs(args)
            .map((desc) => {
                const localName = locals.find((l) => l.index === localIndex)?.nameEntry?.string || `var${localIndex}`;
                localIndex += localSize(desc);

                return `${formatDesc(desc, refHolder)} ${escapeLiteral(localName)}`;
            })
            .join(", ");
        result += ")";

        const exceptions = method.attrs.find((a) => a.type === AttributeType.EXCEPTIONS);
        if (exceptions) {
            const entries = (exceptions as ExceptionsAttribute).entries
                .filter((e) => Boolean(e.entry))
                .map((e) => refHolder.name(e.entry.nameEntry.string));

            if (entries.length > 0) {
                result += " throws ";
                result += entries.join(", ");
            }
        }
    }

    result += code ? ` {\n${block(disassembleCode(code, node.pool, indent, refHolder), indent)}}\n` : ";\n";

    if (writeRefs) {
        const refs = refHolder.refs();
        if (refs.length > 0) {
            result = refs.map((r) => `import ${r};`).join("\n") + "\n\n" + result;
        }
    }

    return result;
};

const disassembleField = (node: Node, field: Member, verbose: boolean, refHolder: ReferenceHolder): string => {
    let result = "";

    const signature = field.attrs.find((a) => a.type === AttributeType.SIGNATURE);
    if (signature) {
        result += `// Signature: ${escapeString((signature as SignatureAttribute).signatureEntry?.string)}\n`;
    }

    if (verbose) {
        result += disassembleAttrs(field);
    }

    result += disassembleAnnos(field, refHolder);
    result += formatMod(field.access, ElementType.FIELD);
    result += `${formatDesc(field.type.string, refHolder)} ${escapeLiteral(field.name.string)}`;

    // ignore constant values for non-static members as per the JVMS
    if ((field.access & Modifier.STATIC) !== 0) {
        const entry = (field.attrs.find((a) => a.type === AttributeType.CONSTANT_VALUE) as ConstantValueAttribute)
            ?.constEntry;
        if (entry) {
            result += ` = ${formatEntry(entry, node.pool)}`;
        }
    }

    result += ";\n";
    return result;
};

const disassemble0 = (node: Node, indent: string, verbose: boolean, refHolder: ReferenceHolder): string => {
    let nodeType = NodeType.CLASS;
    if ((node.access & Modifier.ANNOTATION) !== 0) {
        nodeType = NodeType.ANNOTATION;
    } else if ((node.access & Modifier.INTERFACE) !== 0) {
        nodeType = NodeType.INTERFACE;
    } else if ((node.access & Modifier.ENUM) !== 0) {
        nodeType = NodeType.ENUM;
    } else if ((node.access & Modifier.MODULE) !== 0) {
        nodeType = NodeType.MODULE;
    }

    let result = "";

    const name = node.thisClass.nameEntry.string;
    refHolder.name(name); // reserve name

    const slashIndex = name.lastIndexOf("/");
    const packageName = slashIndex !== -1 ? name.substring(0, slashIndex) : null;
    const simpleName = slashIndex !== -1 ? name.substring(slashIndex + 1) : name;

    const signature = node.attrs.find((a) => a.type === AttributeType.SIGNATURE);
    if (signature) {
        result += `// Signature: ${escapeString((signature as SignatureAttribute).signatureEntry?.string)}\n`;
    }

    if (verbose) {
        result += disassembleAttrs(node);
    }

    result += disassembleAnnos(node, refHolder);
    result += formatMod(
        node.access,
        nodeType === NodeType.CLASS || nodeType === NodeType.ENUM ? ElementType.CLASS : ElementType.INTERFACE
    );

    result += `${nodeType} ${escapeLiteral(simpleName)} `;

    if (node.superClass) {
        const superName = node.superClass.nameEntry.string;
        result += `extends ${refHolder.name(superName)} `;
    }
    if (node.interfaces.length !== 0) {
        const ifNames = node.interfaces.map((i) => refHolder.name(i.nameEntry.string));
        result += `implements ${ifNames.join(", ")} `;
    }

    result += "{\n";
    for (const method of node.fields) {
        result += block(disassembleField(node, method, verbose, refHolder), indent);
    }
    if (node.fields.length !== 0) result += "\n"; // spacer
    for (const method of node.methods) {
        result += block(disassembleMethod0(node, method, indent, verbose, refHolder, false), indent);
    }
    result += "}";

    const refs = refHolder.refs();
    if (refs.length > 0) {
        result =
            refs
                .filter((r) => r !== name)
                .map((r) => `import ${r};`)
                .join("\n") +
            "\n\n" +
            result;
    }

    if (packageName) {
        result = `package ${escapeLiteral(packageName).replaceAll("/", ".")};\n\n` + result;
    }
    const sourceFile = node.attrs.find((a) => a.type === AttributeType.SOURCE_FILE);
    if (sourceFile) {
        result =
            `// Source file: ${escapeString((sourceFile as SourceFileAttribute).sourceFileEntry?.string)}\n` + result;
    }

    return result;
};

export interface DisassemblyOptions {
    indent?: string; // the indentation string, defaults to 4 spaces
    fullyQualified?: boolean; // whether class references should be fully qualified, defaults to true
    verbose?: boolean; // whether to include verbose information like attributes, defaults to false
}

const defaultOptions: DisassemblyOptions = {
    indent: "    ",
    fullyQualified: true,
    verbose: false,
};

export const disassembleMethod = (node: Node, method: Member, options: DisassemblyOptions = {}): string => {
    const refHolder = (options.fullyQualified ?? defaultOptions.fullyQualified) ? emptyRefHolder : createRefHolder();

    return disassembleMethod0(
        node,
        method,
        options.indent ?? defaultOptions.indent,
        options.verbose ?? defaultOptions.verbose,
        refHolder,
        true
    );
};

export const disassemble = (node: Node, options: DisassemblyOptions = {}): string => {
    const refHolder = (options.fullyQualified ?? defaultOptions.fullyQualified) ? emptyRefHolder : createRefHolder();

    return disassemble0(
        node,
        options.indent ?? defaultOptions.indent,
        options.verbose ?? defaultOptions.verbose,
        refHolder
    );
};
