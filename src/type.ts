export enum TypeKind {
    OBJECT,
    PRIMITIVE,
    METHOD,
    ARRAY,

    // generic types
    TYPE_VARIABLE,
    TYPE_PARAMETER,
    PARAMETERIZED,
    WILDCARD,
    CLASS,
}

export interface Type {
    kind: TypeKind;
    name: string;

    get value(): string;
}

export const PrimitiveType: {
    VOID: Type;
    BOOLEAN: Type;
    BYTE: Type;
    CHAR: Type;
    SHORT: Type;
    INT: Type;
    LONG: Type;
    FLOAT: Type;
    DOUBLE: Type;
} = {
    VOID: {
        kind: TypeKind.PRIMITIVE,
        get value() {
            return "V";
        },
        get name() {
            return "void";
        },
    },
    BOOLEAN: {
        kind: TypeKind.PRIMITIVE,
        get value() {
            return "Z";
        },
        get name() {
            return "boolean";
        },
    },
    BYTE: {
        kind: TypeKind.PRIMITIVE,
        get value() {
            return "B";
        },
        get name() {
            return "byte";
        },
    },
    CHAR: {
        kind: TypeKind.PRIMITIVE,
        get value() {
            return "C";
        },
        get name() {
            return "char";
        },
    },
    SHORT: {
        kind: TypeKind.PRIMITIVE,
        get value() {
            return "S";
        },
        get name() {
            return "short";
        },
    },
    INT: {
        kind: TypeKind.PRIMITIVE,
        get value() {
            return "I";
        },
        get name() {
            return "int";
        },
    },
    LONG: {
        kind: TypeKind.PRIMITIVE,
        get value() {
            return "J";
        },
        get name() {
            return "long";
        },
    },
    FLOAT: {
        kind: TypeKind.PRIMITIVE,
        get value() {
            return "F";
        },
        get name() {
            return "float";
        },
    },
    DOUBLE: {
        kind: TypeKind.PRIMITIVE,
        get value() {
            return "D";
        },
        get name() {
            return "double";
        },
    },
};

export interface ArrayType extends Type {
    kind: TypeKind.ARRAY;
    dimensions: number;
    elementType: Type;
}

export interface TypeVariable extends Type {
    kind: TypeKind.TYPE_VARIABLE;
    identifier: string;
}

export interface TypeParameter extends Type {
    kind: TypeKind.TYPE_PARAMETER;
    identifier: string;
    classBound?: Type;
    interfaceBounds?: Type[];
}

export interface ParameterizedType extends Type {
    kind: TypeKind.PARAMETERIZED;
    rawType: Type;
    typeArguments: Type[];
}

export interface WildcardType extends Type {
    kind: TypeKind.WILDCARD;
    bound?: Type;
    boundType: "extends" | "super" | "unbounded";
}

export interface MethodType extends Type {
    kind: TypeKind.METHOD;
    parameters: Type[];
    returnType: Type;
    typeParameters?: TypeParameter[];
}

export interface ClassType extends Type {
    kind: TypeKind.CLASS;
    typeParameters: TypeParameter[];
    superClass: Type;
    interfaces: Type[];
}

const primTypes = new Map<string, Type>([
    ["B", PrimitiveType.BYTE],
    ["C", PrimitiveType.CHAR],
    ["D", PrimitiveType.DOUBLE],
    ["F", PrimitiveType.FLOAT],
    ["I", PrimitiveType.INT],
    ["J", PrimitiveType.LONG],
    ["S", PrimitiveType.SHORT],
    ["Z", PrimitiveType.BOOLEAN],
    ["V", PrimitiveType.VOID],
]);

const wildcardProto: Partial<WildcardType> = {
    kind: TypeKind.WILDCARD,
    get value() {
        return this.bound
            ? this.boundType === "unbounded"
                ? "*"
                : `${this.boundType === "extends" ? "+" : "-"}${this.bound.value}`
            : "*";
    },
    get name() {
        return this.bound ? (this.boundType === "unbounded" ? "?" : `? ${this.boundType} ${this.bound.name}`) : "?";
    },
};

const parseTypeArguments = (signature: string, offset: number): { typeArgs: Type[]; endOffset: number } => {
    const typeArgs: Type[] = [];
    while (signature.charAt(offset) !== ">") {
        const char = signature.charAt(offset);
        switch (char) {
            case "*": {
                typeArgs.push({
                    ...wildcardProto,
                    boundType: "unbounded",
                } as WildcardType);
                offset++;
                break;
            }
            case "+": {
                const { type: boundType, endOffset: newOffset } = parseTypeFromSignature(signature, offset + 1);
                typeArgs.push({
                    ...wildcardProto,
                    bound: boundType,
                    boundType: "extends",
                } as WildcardType);
                offset = newOffset;
                break;
            }
            case "-": {
                const { type: boundType, endOffset: newOffset } = parseTypeFromSignature(signature, offset + 1);
                typeArgs.push({
                    ...wildcardProto,
                    bound: boundType,
                    boundType: "super",
                } as WildcardType);
                offset = newOffset;
                break;
            }
            default: {
                const { type, endOffset: newOffset } = parseTypeFromSignature(signature, offset);
                typeArgs.push(type);
                offset = newOffset;
                break;
            }
        }
    }

    return { typeArgs, endOffset: offset + 1 };
};

const parseTypeFromSignature = (signature: string, offset: number): { type: Type; endOffset: number } => {
    const char = signature.charAt(offset);

    const primitive = primTypes.get(char);
    if (primitive) {
        return {
            type: primitive,
            endOffset: offset + 1,
        };
    }

    switch (char) {
        case "T": {
            const endOffset = signature.indexOf(";", offset);
            if (endOffset === -1) {
                throw new Error(
                    `Invalid type variable signature ${signature.substring(offset)}, missing trailing semicolon`
                );
            }

            return {
                type: {
                    kind: TypeKind.TYPE_VARIABLE,
                    identifier: signature.substring(offset + 1, endOffset),
                    get value() {
                        return `T${this.identifier};`;
                    },
                    get name() {
                        return this.identifier;
                    },
                } as TypeVariable,
                endOffset: endOffset + 1,
            };
        }
        case "L": {
            return parseClassType(signature, offset);
        }
        case "[": {
            return parseArrayType(signature, offset);
        }
    }

    throw new Error(`Invalid type signature ${char}`);
};

const parseArrayType = (signature: string, offset: number): { type: Type; endOffset: number } => {
    let dimensions = 0;
    while (signature.charAt(offset) === "[") {
        dimensions++;
        offset++;
    }

    const { type: elementType, endOffset } = parseTypeFromSignature(signature, offset);
    return {
        type: {
            kind: TypeKind.ARRAY,
            dimensions,
            elementType,
            get value() {
                return "[".repeat(this.dimensions) + this.elementType.value;
            },
            get name() {
                return this.elementType.name + "[]".repeat(this.dimensions);
            },
        } as ArrayType,
        endOffset,
    };
};

const parseClassType = (signature: string, offset: number): { type: Type; endOffset: number } => {
    const start = offset + 1;
    let nameEnd = start;
    let hasGenerics = false;

    while (nameEnd < signature.length) {
        const c = signature.charAt(nameEnd);
        if (c === "<") {
            hasGenerics = true;
            break;
        } else if (c === ";") {
            break;
        }
        nameEnd++;
    }

    if (nameEnd >= signature.length) {
        throw new Error(`Invalid class type descriptor ${signature.substring(offset)}, missing trailing semicolon`);
    }

    const className = signature.substring(start, nameEnd).replaceAll("/", ".");
    const rawType: Type = {
        kind: TypeKind.OBJECT,
        name: className,
        get value() {
            return `L${this.name.replaceAll(".", "/")};`;
        },
    };

    if (hasGenerics) {
        const { typeArgs, endOffset: typeArgsEnd } = parseTypeArguments(signature, nameEnd + 1);

        let actualEnd = typeArgsEnd;
        while (actualEnd < signature.length && signature.charAt(actualEnd) !== ";") {
            actualEnd++;
        }

        if (actualEnd >= signature.length || signature.charAt(actualEnd) !== ";") {
            throw new Error(
                `Invalid parameterized class type descriptor ${signature.substring(offset)}, missing trailing semicolon`
            );
        }

        return {
            type: {
                kind: TypeKind.PARAMETERIZED,
                rawType,
                typeArguments: typeArgs,
                get value() {
                    return `${this.rawType.value.substring(0, this.rawType.value.length - 1)}<${this.typeArguments.map((t) => t.value).join("")}>;`;
                },
                get name() {
                    return `${this.rawType.name}<${this.typeArguments.map((t) => t.name).join(", ")}>`;
                },
            } as ParameterizedType,
            endOffset: actualEnd + 1,
        };
    } else {
        if (signature.charAt(nameEnd) !== ";") {
            throw new Error(`Invalid class type descriptor ${signature.substring(offset)}, missing trailing semicolon`);
        }

        return {
            type: rawType,
            endOffset: nameEnd + 1,
        };
    }
};

const parseMethodParameters = (params: string): Type[] => {
    const paramTypes: Type[] = [];

    let offset = 0;
    while (offset < params.length) {
        const { type, endOffset } = parseTypeFromSignature(params, offset);
        paramTypes.push(type);
        offset = endOffset;
    }

    return paramTypes;
};

export const parseType = (desc: string): Type => {
    const primitive = primTypes.get(desc);
    if (primitive) {
        return primitive;
    }

    switch (desc.charAt(0)) {
        case "T": {
            const { type } = parseTypeFromSignature(desc, 0);
            return type;
        }
        case "[": {
            const { type } = parseArrayType(desc, 0);
            return type;
        }
        case "L": {
            const { type } = parseClassType(desc, 0);
            return type;
        }
        case "<": {
            const closeAngle = desc.indexOf(">");
            if (closeAngle === -1) {
                throw new Error(`Invalid generic signature ${desc}, missing closing angle bracket`);
            }

            const typeParams: TypeParameter[] = [];

            let offset = 1;
            while (offset < closeAngle) {
                const colonIndex = desc.indexOf(":", offset);
                if (colonIndex === -1) {
                    throw new Error(`Invalid type parameter in ${desc}`);
                }

                const identifier = desc.substring(offset, colonIndex);
                let classBound: Type | undefined;
                const interfaceBounds: Type[] = [];

                offset = colonIndex + 1;

                if (offset < closeAngle && desc.charAt(offset) !== ":") {
                    const { type, endOffset } = parseTypeFromSignature(desc, offset);
                    classBound = type;
                    offset = endOffset;
                }

                while (offset < closeAngle && desc.charAt(offset) === ":") {
                    offset++;
                    const { type, endOffset } = parseTypeFromSignature(desc, offset);
                    interfaceBounds.push(type);
                    offset = endOffset;
                }

                typeParams.push({
                    kind: TypeKind.TYPE_PARAMETER,
                    identifier,
                    classBound,
                    interfaceBounds,
                    get name() {
                        return `${this.identifier} ${this.classBound ? `super ${this.classBound.value}` : `extends ${this.interfaceBounds.map((i) => i.name).join(" & ")}`}`;
                    },
                    get value() {
                        return `${this.identifier}:${this.classBound?.value || ""}${this.interfaceBounds?.map((b) => `:${b.value}`)?.join("") || ""}`;
                    },
                } as TypeParameter);
            }

            const restSignature = desc.substring(closeAngle + 1);

            if (restSignature.charAt(0) === "(") {
                const lastParen = restSignature.lastIndexOf(")");
                if (lastParen === -1) {
                    throw new Error(`Invalid method signature ${desc}, missing closing parenthesis`);
                }

                const params = restSignature.substring(1, lastParen);
                const paramTypes = parseMethodParameters(params);
                const returnType = parseType(restSignature.substring(lastParen + 1));

                return {
                    kind: TypeKind.METHOD,
                    parameters: paramTypes,
                    returnType,
                    typeParameters: typeParams,
                    get value() {
                        return `<${this.typeParameters.map((t) => t.value).join("")}>(${this.parameters.map((t) => t.value).join("")})${this.returnType.value}`;
                    },
                    get name() {
                        return `<${this.typeParameters.map((t) => t.name).join(", ")}>(${this.parameters.map((t) => t.name).join(", ")}): ${this.returnType.name}`;
                    },
                } as MethodType;
            } else {
                let currentOffset = 0;
                const { type: superclass, endOffset } = parseTypeFromSignature(restSignature, currentOffset);
                const interfaces: Type[] = [];

                let interfaceOffset = endOffset;
                while (interfaceOffset < restSignature.length) {
                    const { type, endOffset: newOffset } = parseTypeFromSignature(restSignature, interfaceOffset);
                    interfaces.push(type);
                    interfaceOffset = newOffset;
                }

                return {
                    kind: TypeKind.CLASS,
                    typeParameters: typeParams,
                    superClass: superclass,
                    interfaces,
                    get value() {
                        return `<${this.typeParameters.map((t) => t.value).join("")}>${this.superClass.value}${this.interfaces.length > 0 ? this.interfaces.map((i) => i.value).join("") : ""}`;
                    },
                    get name() {
                        return `<${this.typeParameters.map((t) => t.name).join(", ")}> extends ${this.superClass.name}${this.interfaces.length > 0 ? ` implements ${this.interfaces.map((i) => i.name).join(", ")}` : ""}`;
                    },
                } as ClassType;
            }
        }
        case "(": {
            const lastParen = desc.lastIndexOf(")");
            if (lastParen === -1) {
                throw new Error(`Invalid method type descriptor ${desc}, missing closing parenthesis`);
            }

            const params = desc.substring(1, lastParen);
            const paramTypes = parseMethodParameters(params);
            const returnType = parseType(desc.substring(lastParen + 1));

            return {
                kind: TypeKind.METHOD,
                parameters: paramTypes,
                returnType,
                get value() {
                    return `(${this.parameters.map((t) => t.value).join("")})${this.returnType.value}`;
                },
                get name() {
                    return `(${this.parameters.map((t) => t.name).join(", ")}): ${this.returnType.name}`;
                },
            } as MethodType;
        }
    }

    throw new Error(`Invalid type descriptor ${desc}`);
};

export const tryParseType = (desc: string): Type | null => {
    try {
        return parseType(desc);
    } catch (e) {}

    return null;
};
