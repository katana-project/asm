import { expect } from "chai";
import { type Dirent, opendirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { read, write } from "../";
import { methodType, MethodType, objectType, parseType, Type, TypeKind } from "../type";
import { disassemble } from "./disasm";
import { remap } from "./remap";

describe("remapping", () => {
    const register = (path: string) => {
        const expected = new Uint8Array(readFileSync(path));
        it(`remap ${path}`, () => {
            const node = read(expected);

            let countCls = 0,
                countRef = 0;
            const valueToType = new Map<string, Type>();
            const remapType = (origType: Type): Type => {
                let type = valueToType.get(origType.value);
                if (!type) {
                    switch (origType.kind) {
                        case TypeKind.METHOD: {
                            const mthType = origType as MethodType;
                            type = methodType(mthType.parameters.map(remapType), remapType(mthType.returnType));
                            break;
                        }
                        default: {
                            type = objectType(`Lcls${countCls++};`);
                            break;
                        }
                    }
                    valueToType.set(origType.value, type);
                }

                return type;
            };

            const valueToRef = new Map<string, string>();
            const remapRef = (owner: Type, name: string, desc: Type): string => {
                const key = `${owner.value} ${name} ${desc.value}`;
                let ref = valueToRef.get(key);
                if (!ref) {
                    ref = `ref${countRef++}`;
                    valueToRef.set(key, ref);
                }
                return ref;
            };

            remap(node, {
                type(type: Type): Type {
                    console.log(`remapping type ${JSON.stringify(type)}`);
                    expect(parseType(type.value).value).equal(type.value);
                    return remapType(type);
                },
                ref(owner: Type, name: string, desc: Type): string {
                    console.log(`remapping ref ${owner.value} ${name} ${desc.value}`);
                    expect(parseType(owner.value).value).equal(owner.value);
                    expect(parseType(desc.value).value).equal(desc.value);
                    return remapRef(owner, name, desc);
                },
            });

            write(node);
            console.log(
                disassemble(node, {
                    indent: "  ",
                    fullyQualified: true,
                    verbose: true,
                })
            );
        });
    };

    const walk = (path: string) => {
        const dir = opendirSync(path);

        let entry: Dirent | null;
        while ((entry = dir.readSync()) !== null) {
            const childPath = join(path, entry.name);

            if (entry.isFile() && entry.name.endsWith(".class")) {
                register(childPath);
            } else if (entry.isDirectory()) {
                walk(childPath);
            }
        }

        dir.closeSync();
    };

    walk("./samples");
});
