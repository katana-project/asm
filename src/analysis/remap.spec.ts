import { type Dirent, opendirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { read } from "../";
import { parseType, Type } from "../type";
import { remap } from "./remap";

describe("remapping", () => {
    const register = (path: string) => {
        const expected = new Uint8Array(readFileSync(path));
        it(`remap ${path}`, () => {
            const node = read(expected);

            remap(node, {
                type(type: Type): Type {
                    console.log(`remapping type ${JSON.stringify(type)}`);
                    parseType(type.value);
                    return type;
                },
                ref(owner: Type, name: string, desc: Type): string {
                    console.log(`remapping ref ${owner.value} ${name} ${desc.value}`);
                    parseType(owner.value);
                    parseType(desc.value);
                    return name;
                },
            });
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
