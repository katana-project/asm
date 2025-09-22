import { type Dirent, opendirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { read } from "../";
import { disassemble, disassembleMethod } from "./disasm";

describe("disassembly", () => {
    const register = (path: string) => {
        it(`disassemble ${path}`, () => {
            const node = read(new Uint8Array(readFileSync(path)));
            console.log(
                disassemble(node, {
                    indent: "    ",
                    fullyQualified: false,
                    verbose: true,
                })
            );

            console.log("----");

            for (const method of node.methods) {
                console.log(
                    disassembleMethod(node, method, {
                        indent: "    ",
                        fullyQualified: false,
                        verbose: true,
                    })
                );
            }
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
