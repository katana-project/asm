import { opendirSync, readFileSync, type Dirent } from "node:fs";
import { join } from "node:path";
import { read } from "../";
import { remap } from "./remap";

describe("remapping", () => {
    const register = (path: string) => {
        const expected = new Uint8Array(readFileSync(path));
        it(`remap ${path}`, () => {
            const node = read(expected);
            remap(node.pool, (type) => {
                console.log(`remapping ${JSON.stringify(type)}`);
                return type;
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
