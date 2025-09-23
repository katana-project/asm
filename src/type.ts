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

export const parseType = (desc: string): Type => {
    const primitive = primTypes.get(desc);
    if (primitive) {
        return primitive;
    }

    switch (desc.charAt(0)) {
        case "[": {
            let dimensions = 1;
            while (desc.charAt(dimensions) === "[") {
                dimensions++;
            }

            const elementType = parseType(desc.substring(dimensions));
            return {
                value: desc,
                name: elementType.name + "[]".repeat(dimensions),
                dimensions,
                elementType,
            } as ArrayType;
        }
        case "L": {
            if (desc[desc.length - 1] !== ";") {
                throw new Error(`Invalid class type descriptor ${desc}, missing trailing semicolon`);
            }

            const className = desc.substring(1, desc.length - 1).replaceAll("/", ".");

            return {
                value: desc,
                name: className,
            };
        }
        case "(": {
            const lastParen = desc.lastIndexOf(")");
            if (lastParen === -1) {
                throw new Error(`Invalid method type descriptor ${desc}, missing closing parenthesis`);
            }

            const params = desc.substring(1, lastParen);

            const args: string[] = [];
            for (let i = 0; i < params.length; i++) {
                const char = params.charAt(i);
                const start = i;

                switch (char) {
                    case "L": {
                        i = params.indexOf(";", i);
                        args.push(params.substring(start, i + 1));
                        break;
                    }
                    case "[": {
                        while (params.charAt(i) === "[") i++;
                        if (params.charAt(i) === "L") {
                            i = params.indexOf(";", i);
                        }
                        args.push(params.substring(start, i + 1));
                        break;
                    }
                    default: {
                        args.push(char);
                        break;
                    }
                }
            }

            const paramTypes = args.map(parseType);
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
    } catch (e) {}

    return null;
};
