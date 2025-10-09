import { create, wrap } from "../buffer";
import type { ClassEntry, ModularEntry, Pool } from "../pool";
import { AttributeType } from "../spec";
import type { Attribute } from "./";

export interface ModulePackage {
    index: number; // ModularEntry index
    entry?: ModularEntry;
}

/*export interface ModuleAttribute extends Attribute {
    type: AttributeType.MODULE;

    moduleNameIndex: number; // ModularEntry index
    moduleFlags: number;
    moduleVersionIndex: number; // UTF8Entry index, may be 0

    moduleNameEntry?: ModularEntry;
    moduleVersionEntry?: UTF8Entry;
}*/

export interface ModulePackagesAttribute extends Attribute {
    type: AttributeType.MODULE_PACKAGES;

    packages: ModulePackage[];
}

export const readModulePackages = (attr: Attribute, pool: Pool): ModulePackagesAttribute => {
    const buffer = wrap(attr.data);

    const numPackages = buffer.getUint16();
    const packages = new Array<ModulePackage>(numPackages);
    for (let i = 0; i < numPackages; i++) {
        const index = buffer.getUint16();

        packages[i] = { index, entry: pool[index] as ModularEntry | undefined };
    }

    return { ...attr, type: AttributeType.MODULE_PACKAGES, packages };
};

export const writeModulePackages = (attr: ModulePackagesAttribute): Uint8Array => {
    const buffer = create(2 * (1 + attr.packages.length));

    buffer.setUint16(attr.packages.length);
    for (const pkg of attr.packages) {
        if (pkg.entry) {
            pkg.index = pkg.entry.index;
        }

        buffer.setUint16(pkg.index);
    }

    return buffer.arrayView;
};

export interface ModuleMainClassAttribute extends Attribute {
    type: AttributeType.MODULE_MAIN_CLASS;

    mainClassIndex: number; // ClassEntry index
    mainClassEntry?: ClassEntry;
}

export const readModuleMainClass = (attr: Attribute, pool: Pool): ModuleMainClassAttribute => {
    const buffer = wrap(attr.data);

    const mainClassIndex = buffer.getUint16();
    return {
        ...attr,
        type: AttributeType.MODULE_MAIN_CLASS,
        mainClassIndex,
        mainClassEntry: pool[mainClassIndex] as ClassEntry | undefined,
    };
};

export const writeModuleMainClass = (attr: ModuleMainClassAttribute): Uint8Array => {
    const buffer = create(2);
    if (attr.mainClassEntry) {
        attr.mainClassIndex = attr.mainClassEntry.index;
    }

    buffer.setUint16(attr.mainClassIndex);

    return buffer.arrayView;
};
