export interface Type {
    value: string;
    name: string;
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
    VOID: { value: "V", name: "void" },
    BOOLEAN: { value: "Z", name: "boolean" },
    BYTE: { value: "B", name: "byte" },
    CHAR: { value: "C", name: "char" },
    SHORT: { value: "S", name: "short" },
    INT: { value: "I", name: "int" },
    LONG: { value: "J", name: "long" },
    FLOAT: { value: "F", name: "float" },
    DOUBLE: { value: "D", name: "double" },
};

export interface ArrayType extends Type {
    dimensions: number;
    elementType: Type;
}

export type TypeVariable = Type;

export interface TypeParameter extends Type {
    identifier: string;
    classBound?: Type;
    interfaceBounds?: Type[];
}

export interface ParameterizedType extends Type {
    rawType: Type;
    typeArguments: Type[];
}

export interface WildcardType extends Type {
    bound?: Type;
    boundType: "extends" | "super" | "unbounded";
}

export type FieldType = Type;

export interface MethodType extends Type {
    parameters: Type[];
    returnType: Type;
    typeParameters?: TypeParameter[];
}

export interface ClassType extends Type {
    typeParameters: TypeParameter[];
    superClass: Type;
    interfaces?: Type[];
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

const parseTypeArguments = (signature: string, startOffset: number): { typeArgs: Type[], endOffset: number } => {
    const typeArgs: Type[] = [];
    let offset = startOffset;

    while (signature.charAt(offset) !== '>') {
        const char = signature.charAt(offset);
        switch (char) {
            case '*': {
                typeArgs.push({
                    value: '*',
                    name: '?',
                    boundType: 'unbounded'
                } as WildcardType);
                offset++;
                break;
            }
            case '+': {
                const { type: boundType, endOffset: newOffset } = parseTypeFromSignature(signature, offset + 1);
                typeArgs.push({
                    value: signature.substring(offset, newOffset),
                    name: `? extends ${boundType.name}`,
                    bound: boundType,
                    boundType: 'extends'
                } as WildcardType);
                offset = newOffset;
                break;
            }
            case '-': {
                const { type: boundType, endOffset: newOffset } = parseTypeFromSignature(signature, offset + 1);
                typeArgs.push({
                    value: signature.substring(offset, newOffset),
                    name: `? super ${boundType.name}`,
                    bound: boundType,
                    boundType: 'super'
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

const parseTypeFromSignature = (signature: string, startOffset: number): { type: Type, endOffset: number } => {
    let offset = startOffset;
    const char = signature.charAt(offset);

    switch (char) {
        case 'T': {
            const endOffset = signature.indexOf(';', offset);
            if (endOffset === -1) {
                throw new Error(`Invalid type variable signature ${signature.substring(offset)}, missing trailing semicolon`);
            }
            const identifier = signature.substring(offset + 1, endOffset);
            return {
                type: {
                    value: signature.substring(offset, endOffset + 1),
                    name: identifier,
                    identifier
                } as TypeVariable,
                endOffset: endOffset + 1
            };
        }
        case 'L': {
            return parseClassType(signature, offset);
        }
        case '[': {
            return parseArrayType(signature, offset);
        }
        default: {
            const primitive = primTypes.get(char);
            if (primitive) {
                return {
                    type: primitive,
                    endOffset: offset + 1
                };
            }
            throw new Error(`Invalid type signature character: ${char}`);
        }
    }
};

const parseArrayType = (signature: string, startOffset: number): { type: Type, endOffset: number } => {
    let offset = startOffset;
    let dimensions = 0;

    while (signature.charAt(offset) === '[') {
        dimensions++;
        offset++;
    }

    const { type: elementType, endOffset } = parseTypeFromSignature(signature, offset);
    return {
        type: {
            value: signature.substring(startOffset, endOffset),
            name: elementType.name + "[]".repeat(dimensions),
            dimensions,
            elementType
        } as ArrayType,
        endOffset
    };
};

const parseClassType = (signature: string, startOffset: number): { type: Type, endOffset: number } => {
    let offset = startOffset;
    let start = offset + 1;
    let nameEnd = start;
    let hasGenerics = false;

    while (nameEnd < signature.length) {
        const c = signature.charAt(nameEnd);
        if (c === '<') {
            hasGenerics = true;
            break;
        } else if (c === ';') {
            break;
        }
        nameEnd++;
    }

    if (nameEnd >= signature.length) {
        throw new Error(`Invalid class type descriptor ${signature.substring(offset)}, missing trailing semicolon`);
    }

    const className = signature.substring(start, nameEnd).replaceAll("/", ".");

    if (hasGenerics) {
        const { typeArgs, endOffset: typeArgsEnd } = parseTypeArguments(signature, nameEnd + 1);

        let actualEnd = typeArgsEnd;
        while (actualEnd < signature.length && signature.charAt(actualEnd) !== ';') {
            actualEnd++;
        }

        if (actualEnd >= signature.length || signature.charAt(actualEnd) !== ';') {
            throw new Error(`Invalid parameterized class type descriptor ${signature.substring(offset)}, missing trailing semicolon`);
        }

        const rawType: Type = {
            value: `L${className.replaceAll(".", "/")};`,
            name: className
        };

        return {
            type: {
                value: signature.substring(offset, actualEnd + 1),
                name: `${className}<${typeArgs.map(t => t.name).join(', ')}>`,
                rawType,
                typeArguments: typeArgs
            } as ParameterizedType,
            endOffset: actualEnd + 1
        };
    } else {
        if (signature.charAt(nameEnd) !== ';') {
            throw new Error(`Invalid class type descriptor ${signature.substring(offset)}, missing trailing semicolon`);
        }

        return {
            type: {
                value: signature.substring(offset, nameEnd + 1),
                name: className
            },
            endOffset: nameEnd + 1
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
        case 'T': {
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
            const closeAngle = desc.indexOf('>');
            if (closeAngle === -1) {
                throw new Error(`Invalid generic signature ${desc}, missing closing angle bracket`);
            }

            const typeParams: TypeParameter[] = [];
            let offset = 1;

            while (offset < closeAngle) {
                const colonIndex = desc.indexOf(':', offset);
                if (colonIndex === -1) {
                    throw new Error(`Invalid type parameter in ${desc}`);
                }

                const identifier = desc.substring(offset, colonIndex);
                let classBound: Type | undefined;
                const interfaceBounds: Type[] = [];

                offset = colonIndex + 1;

                if (offset < closeAngle && desc.charAt(offset) !== ':') {
                    const { type, endOffset } = parseTypeFromSignature(desc, offset);
                    classBound = type;
                    offset = endOffset;
                }

                while (offset < closeAngle && desc.charAt(offset) === ':') {
                    offset++;
                    const { type, endOffset } = parseTypeFromSignature(desc, offset);
                    interfaceBounds.push(type);
                    offset = endOffset;
                }

                typeParams.push({
                    value: `${identifier}:${classBound?.value || ''}${interfaceBounds.map(b => `:${b.value}`).join('')}`,
                    name: identifier,
                    identifier,
                    classBound,
                    interfaceBounds: interfaceBounds.length > 0 ? interfaceBounds : undefined
                } as TypeParameter);
            }

            const restSignature = desc.substring(closeAngle + 1);

            if (restSignature.charAt(0) === '(') {
                const lastParen = restSignature.lastIndexOf(")");
                if (lastParen === -1) {
                    throw new Error(`Invalid method signature ${desc}, missing closing parenthesis`);
                }

                const params = restSignature.substring(1, lastParen);
                const paramTypes = parseMethodParameters(params);
                const returnType = parseType(restSignature.substring(lastParen + 1));

                return {
                    value: desc,
                    name: `<${typeParams.map(tp => tp.name).join(', ')}>(${paramTypes.map((t) => t.name).join(", ")}): ${returnType.name}`,
                    parameters: paramTypes,
                    returnType,
                    typeParameters: typeParams
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
                    value: desc,
                    name: `<${typeParams.map(tp => tp.name).join(', ')}> extends ${superclass.name}${interfaces.length > 0 ? ` implements ${interfaces.map(i => i.name).join(', ')}` : ''}`,
                    typeParameters: typeParams,
                    superClass: superclass,
                    interfaces: interfaces.length > 0 ? interfaces : undefined
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
                value: desc,
                name: `(${paramTypes.map((t) => t.name).join(", ")}): ${returnType.name}`,
                parameters: paramTypes,
                returnType,
            } as MethodType;
        }
    }

    throw new Error(`Invalid type descriptor ${desc}`);
};

export const tryParseType = (desc: string): Type | null => {
    try {
        return parseType(desc);
    } catch (e) {
        console.warn((e as Error).message);
    }

    return null;
};
