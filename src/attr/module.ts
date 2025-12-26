import { Buffer, create, wrap } from "../buffer";
import type { ClassEntry, Entry, ModularEntry, Pool, UTF8Entry } from "../pool";
import { AttributeType } from "../spec";
import type { Attribute } from "./";

export interface ModulePackage {
    index: number; // ModularEntry index
    entry?: ModularEntry;
}

export interface ModuleAttribute extends Attribute {
    type: AttributeType.MODULE;

    moduleNameIndex: number; // ModularEntry index
    moduleFlags: number;
    moduleVersionIndex: number; // UTF8Entry index, may be 0

    moduleNameEntry?: ModularEntry;
    moduleVersionEntry?: UTF8Entry;

    requires: ModuleRequires[];
    exports: ModuleExportsOpens[];
    opens: ModuleExportsOpens[];
    uses: ModuleRelation<ClassEntry>[];
    provides: ModuleProvides[];
}

export interface ModuleRelation<E extends Entry> {
    index: number;
    entry?: E;
}

export interface ModuleRequires extends ModuleRelation<ModularEntry> {
    flags: number;
    versionIndex: number; // UTF8Entry index, may be 0
    versionEntry?: UTF8Entry;
}

export interface ModuleExportsOpens extends ModuleRelation<ModularEntry> {
    flags: number;
    to: ModuleRelation<ModularEntry>[];
}

export interface ModuleProvides extends ModuleRelation<ClassEntry> {
    with: ModuleRelation<ClassEntry>[];
}

const readRelations = <E extends Entry>(buffer: Buffer, pool: Pool): ModuleRelation<E>[] => {
    const numRelations = buffer.getUint16();
    const relations = new Array<ModuleRelation<E>>(numRelations);
    for (let i = 0; i < numRelations; i++) {
        const index = buffer.getUint16();
        relations[i] = { index, entry: pool[index] as E | undefined };
    }
    return relations;
};

const readExportsOpens = (buffer: Buffer, pool: Pool): ModuleExportsOpens[] => {
    const numRelations = buffer.getUint16();
    const relations = new Array<ModuleExportsOpens>(numRelations);
    for (let i = 0; i < numRelations; i++) {
        const index = buffer.getUint16();
        const flags = buffer.getUint16();
        const to = readRelations<ModularEntry>(buffer, pool);

        relations[i] = {
            index,
            flags,
            to,
            entry: pool[index] as ModularEntry | undefined,
        };
    }
    return relations;
};

export const readModule = (attr: Attribute, pool: Pool): ModuleAttribute => {
    const buffer = wrap(attr.data);

    const moduleNameIndex = buffer.getUint16();
    const moduleFlags = buffer.getUint16();
    const moduleVersionIndex = buffer.getUint16();

    const numRequires = buffer.getUint16();
    const requires = new Array<ModuleRequires>(numRequires);
    for (let i = 0; i < numRequires; i++) {
        const index = buffer.getUint16();
        const flags = buffer.getUint16();
        const versionIndex = buffer.getUint16();

        requires[i] = {
            index,
            flags,
            versionIndex,
            entry: pool[index] as ModularEntry | undefined,
            versionEntry: versionIndex > 0 ? pool[versionIndex] as UTF8Entry | undefined : undefined,
        };
    }

    const exports = readExportsOpens(buffer, pool);
    const opens = readExportsOpens(buffer, pool);
    const uses = readRelations<ClassEntry>(buffer, pool);

    const numProvides = buffer.getUint16();
    const provides = new Array<ModuleProvides>(numProvides);
    for (let i = 0; i < numProvides; i++) {
        const index = buffer.getUint16();
        const withRelations = readRelations<ClassEntry>(buffer, pool);

        provides[i] = {
            index,
            with: withRelations,
            entry: pool[index] as ClassEntry | undefined,
        };
    }

    return {
        ...attr,
        type: AttributeType.MODULE,
        moduleNameIndex,
        moduleFlags,
        moduleVersionIndex,
        moduleNameEntry: pool[moduleNameIndex] as ModularEntry | undefined,
        moduleVersionEntry: moduleVersionIndex > 0 ? pool[moduleVersionIndex] as UTF8Entry | undefined : undefined,
        requires,
        exports,
        opens,
        uses,
        provides,
    };
};

const writeRelations = (buffer: Buffer, relations: ModuleRelation<any>[]) => {
    buffer.setUint16(relations.length);
    for (const rel of relations) {
        if (rel.entry) {
            rel.index = rel.entry.index;
        }

        buffer.setUint16(rel.index);
    }
};

const writeExportsOpens = (buffer: Buffer, exportsOpens: ModuleExportsOpens[]) => {
    buffer.setUint16(exportsOpens.length);
    for (const rel of exportsOpens) {
        if (rel.entry) {
            rel.index = rel.entry.index;
        }

        buffer.setUint16(rel.index);
        buffer.setUint16(rel.flags);
        writeRelations(buffer, rel.to);
    }
};

export const writeModule = (attr: ModuleAttribute): Uint8Array => {
    // not going to approximate size here
    const buffer = create();

    if (attr.moduleNameEntry) {
        attr.moduleNameIndex = attr.moduleNameEntry.index;
    }
    if (attr.moduleVersionEntry) {
        attr.moduleVersionIndex = attr.moduleVersionEntry.index;
    }

    buffer.setUint16(attr.moduleNameIndex);
    buffer.setUint16(attr.moduleFlags);
    buffer.setUint16(attr.moduleVersionIndex);

    buffer.setUint16(attr.requires.length);
    for (const req of attr.requires) {
        if (req.entry) {
            req.index = req.entry.index;
        }
        if (req.versionEntry) {
            req.versionIndex = req.versionEntry.index;
        }

        buffer.setUint16(req.index);
        buffer.setUint16(req.flags);
        buffer.setUint16(req.versionIndex);
    }

    writeExportsOpens(buffer, attr.exports);
    writeExportsOpens(buffer, attr.opens);
    writeRelations(buffer, attr.uses);

    buffer.setUint16(attr.provides.length);
    for (const prov of attr.provides) {
        if (prov.entry) {
            prov.index = prov.entry.index;
        }

        buffer.setUint16(prov.index);
        writeRelations(buffer, prov.with);
    }

    return buffer.arrayView;
};

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
