import { create, wrap } from "../buffer";
import { Opcode } from "../spec";
import { Instruction } from "./";

const TYPICAL_SWITCH_SIZE = 16;

export interface SwitchInstruction extends Instruction {
    opcode: Opcode.TABLESWITCH | Opcode.LOOKUPSWITCH;
    defaultOffset: number;
    jumpOffsets: number[];
}

export interface TableSwitchInstruction extends SwitchInstruction {
    opcode: Opcode.TABLESWITCH;
    lowCase: number;
    highCase: number;
}

export interface LookupSwitchInstruction extends SwitchInstruction {
    opcode: Opcode.LOOKUPSWITCH;
    cases: number[];
}

export const readSwitch = (insn: Instruction): SwitchInstruction => {
    const buffer = wrap(insn.operands);

    const switchInsn: Partial<SwitchInstruction> = {
        ...insn,
        defaultOffset: buffer.getInt32(),
    };

    if (insn.opcode === Opcode.TABLESWITCH) {
        const tableSwInsn = switchInsn as TableSwitchInstruction;

        tableSwInsn.lowCase = buffer.getInt32();
        tableSwInsn.highCase = buffer.getInt32();

        const jumpOffsetCount = tableSwInsn.highCase - tableSwInsn.lowCase + 1;
        switchInsn.jumpOffsets = new Array<number>(jumpOffsetCount);

        for (let i = 0; i < jumpOffsetCount; i++) {
            switchInsn.jumpOffsets[i] = buffer.getInt32();
        }
    } else if (insn.opcode === Opcode.LOOKUPSWITCH) {
        const lookupSwInsn = switchInsn as LookupSwitchInstruction;

        const jumpOffsetCount = buffer.getInt32();
        lookupSwInsn.cases = new Array<number>(jumpOffsetCount);
        lookupSwInsn.jumpOffsets = new Array<number>(jumpOffsetCount);

        for (let i = 0; i < jumpOffsetCount; i++) {
            lookupSwInsn.cases[i] = buffer.getInt32();
            lookupSwInsn.jumpOffsets[i] = buffer.getInt32();
        }
    } else {
        throw new Error(`Unrecognized switch opcode ${insn.opcode}`);
    }

    return switchInsn as SwitchInstruction;
};

export const writeSwitch = (insn: SwitchInstruction, initialSize: number = TYPICAL_SWITCH_SIZE): Instruction => {
    const buffer = create(initialSize);

    buffer.setInt32(insn.defaultOffset);
    if (insn.opcode === Opcode.TABLESWITCH) {
        const tableSwInsn = insn as TableSwitchInstruction;

        buffer.setInt32(tableSwInsn.lowCase);
        buffer.setInt32(tableSwInsn.highCase);

        for (const jumpOffset of tableSwInsn.jumpOffsets) {
            buffer.setInt32(jumpOffset);
        }
    } else if (insn.opcode === Opcode.LOOKUPSWITCH) {
        const lookupSwInsn = insn as LookupSwitchInstruction;

        buffer.setInt32(lookupSwInsn.jumpOffsets.length);

        for (let i = 0; i < lookupSwInsn.jumpOffsets.length; i++) {
            buffer.setInt32(lookupSwInsn.cases[i]);
            buffer.setInt32(lookupSwInsn.jumpOffsets[i]);
        }
    } else {
        throw new Error(`Unrecognized switch opcode ${insn.opcode}`);
    }

    return { ...insn, operands: buffer.arrayView };
};

export const switchValue = (insn: SwitchInstruction, jumpIndex: number) => {
    if (insn.opcode === Opcode.TABLESWITCH) {
        return (insn as TableSwitchInstruction).lowCase + jumpIndex;
    }

    return (insn as LookupSwitchInstruction).cases[jumpIndex];
};
