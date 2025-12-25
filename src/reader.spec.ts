import { expect } from "chai";
import { opendirSync, readFileSync, type Dirent } from "node:fs";
import { join } from "node:path";
import { FLAG_SKIP_ATTR, read, write } from "./";
import type { Attributable, CodeAttribute } from "./attr";
import { AttributeType } from "./spec";

describe("reader", () => {
    it("read samples/zkm/sample/string/StringsLong.class", async () => {
        const expected = readFileSync("samples/zkm/sample/string/StringsLong.class");
        const result = read(expected);

        expect(result.magic).equal(0xcafebabe);

        const name = result.thisClass.nameEntry.string;
        expect(name).equal("sample/string/StringsLong");

        // for (const attribute of result.attributes) {
        //     console.log(new TextDecoder().decode(attribute.name.data));
        // }
    });
});

const markDirty = (attrib: Attributable) => {
    for (const attr of attrib.attrs) {
        attr.dirty = true;
        if ("attrs" in attr) {
            markDirty(attr as Attributable);
        }

        // mark instructions as dirty
        if (attr.type === AttributeType.CODE) {
            const code = attr as CodeAttribute;
            for (const insn of code.insns) {
                insn.dirty = true;
            }
        }
    }
};

describe("reader+writer", () => {
    const register = (path: string) => {
        const expected = new Uint8Array(readFileSync(path));
        it(`read ${path}`, () => {
            read(expected, FLAG_SKIP_ATTR);
        });

        it(`round-trip ${path}`, () => {
            const node = read(expected);

            // force attribute rewrite
            markDirty(node);
            for (const member of [...node.fields, ...node.methods]) {
                markDirty(member);
            }

            const result = write(node);

            expect(result).deep.equal(expected);
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
