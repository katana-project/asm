import type { CodeAttribute } from "../attr";
import type { BranchInstruction, Instruction, SwitchInstruction } from "../insn";
import { switchValue } from "../insn/switch";
import { Opcode } from "../spec";

const TERMINAL_OPCODES = new Set<number>([
    Opcode.IRETURN,
    Opcode.LRETURN,
    Opcode.FRETURN,
    Opcode.DRETURN,
    Opcode.ARETURN,
    Opcode.RETURN,
    Opcode.ATHROW,
    Opcode.RET,
]);

export interface Node {
    offset: number;
    insns: Instruction[];
    leaf: boolean;
}

export enum EdgeType {
    UNSPECIFIC,
    CONDITION_TRUE,
    CONDITION_FALSE,
    SWITCH_DEFAULT,
    SWITCH_BRANCH,
}

export interface UndirectedEdge {
    type: EdgeType;
    target: number;
    jump: boolean;

    value?: number; // for SWITCH_BRANCH
}

export interface Edge extends UndirectedEdge {
    source: number;
}

export interface Graph {
    nodes: Node[];
    edges: Edge[];
}

const getTargetEdges = (insn: Instruction): UndirectedEdge[] => {
    switch (insn.opcode) {
        case Opcode.TABLESWITCH:
        case Opcode.LOOKUPSWITCH: {
            const { defaultOffset, jumpOffsets } = insn as SwitchInstruction;

            return [
                { target: insn.offset + defaultOffset, type: EdgeType.SWITCH_DEFAULT, jump: true },
                ...jumpOffsets.map((offset, i) => ({
                    target: insn.offset + offset,
                    type: EdgeType.SWITCH_BRANCH,
                    jump: true,
                    value: switchValue(insn as SwitchInstruction, i),
                })),
            ];
        }
        case Opcode.GOTO:
        case Opcode.GOTO_W:
            return [
                {
                    target: insn.offset + (insn as BranchInstruction).branchOffset,
                    type: EdgeType.UNSPECIFIC,
                    jump: true,
                },
            ];
        case Opcode.IFEQ:
        case Opcode.IFNE:
        case Opcode.IFLT:
        case Opcode.IFGE:
        case Opcode.IFGT:
        case Opcode.IFLE:
        case Opcode.IF_ICMPEQ:
        case Opcode.IF_ICMPNE:
        case Opcode.IF_ICMPLT:
        case Opcode.IF_ICMPGE:
        case Opcode.IF_ICMPGT:
        case Opcode.IF_ICMPLE:
        case Opcode.IF_ACMPEQ:
        case Opcode.IF_ACMPNE:
        case Opcode.JSR:
        case Opcode.JSR_W:
        case Opcode.IFNULL:
        case Opcode.IFNONNULL:
            return [
                {
                    target: insn.offset + insn.length /* next offset */,
                    type: EdgeType.CONDITION_FALSE,
                    jump: false,
                },
                {
                    target: insn.offset + (insn as BranchInstruction).branchOffset,
                    type: EdgeType.CONDITION_TRUE,
                    jump: true,
                },
            ];
    }

    return [];
};

export const computeGraph = (code: CodeAttribute): Graph => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const insnTargets = code.insns.map(getTargetEdges);
    const insnLeaders = new Set<number>([
        0,
        ...code.exceptionTable.flatMap((e) => [e.startPC, e.endPC, e.handlerPC]),
        ...insnTargets.flatMap((t, i) => {
            const insn = code.insns[i];

            // if we're jumping, the next instruction will always be in a new logical block
            return t.length > 0 ? [insn.offset + insn.length /* next offset */, ...t.map((e) => e.target)] : [];
        }),
    ]);

    let currentNode: Node = { offset: -1, insns: [], leaf: true };
    for (let i = 0; i < code.insns.length; i++) {
        const insn = code.insns[i];
        if (insnLeaders.has(insn.offset)) {
            const lastInsn = code.insns[i - 1];
            if (lastInsn && !TERMINAL_OPCODES.has(lastInsn.opcode)) {
                currentNode.leaf = false;
                if (insnTargets[i - 1].length === 0) {
                    // didn't return/throw nor jump, reconnect
                    edges.push({
                        type: EdgeType.UNSPECIFIC,
                        source: currentNode.offset,
                        target: insn.offset,
                        jump: false,
                    });
                }
            }

            currentNode = { offset: insn.offset, insns: [], leaf: true };
            nodes.push(currentNode);
        }

        currentNode.insns.push(insn);
        for (const target of insnTargets[i]) {
            edges.push({ ...target, source: currentNode.offset });
        }
    }

    return { nodes, edges };
};
