from datetime import datetime
from argparse import ArgumentParser
from os import makedirs
from os.path import isfile, exists, join
from json import load
from lib.utils import eprint, dir_path
from re import compile

CAMEL_CASE_PATTERN = compile(r"(?<!^)(?=[A-Z])")


def to_upper_snake(s: str) -> str:
    return CAMEL_CASE_PATTERN.sub("_", s).upper()


class Generator:
    MEMBERS = {
        "./opcode": ["Opcode"],
        "./modifier": ["Modifier"],
        "./attr_type": ["AttributeType"],
        "./const_type": ["ConstantType"],
        "./handle_kind": ["HandleKind"],
        "./array_code": ["ArrayCode"]
    }

    def __init__(self, output_dir: str):
        self.output_dir = output_dir
        self.build_ts = datetime.now()

    def _source_path(self, file_name: str) -> str:
        return join(self.output_dir, file_name)

    def _write_header(self, f):
        f.write(f"// This file was generated on {self.build_ts}. Do not edit, changes will be overwritten!\n\n")

    def _generate_opcodes(self, p_input: dict):
        with open(self._source_path("opcode.ts"), "w", encoding="utf-8") as f:
            self._write_header(f)

            f.write("/** JVM opcodes. */\n")
            f.write("export enum Opcode {")
            for insn in p_input["insns"]:
                for insn_variant in insn["values"]:
                    f.write("\n\t/**\n")

                    replaced_op = insn["operation"].replace("\n", "\n\t * ")
                    if insn["name"] != insn_variant["name"]:
                        f.write(f"\t * `{insn['name']}` instruction, variant `{insn_variant['name']}`"
                                f" - {replaced_op}.\n")
                    else:
                        f.write(f"\t * `{insn['name']}` instruction - {replaced_op}.\n")

                    f.write("\t *\n")
                    f.write(f"\t * {insn["description"].replace("\n", "\n\t * ")}\n")
                    f.write("\t *\n")
                    f.write("\t * Operands:\n")

                    for insn_format in insn["formats"]:
                        f.write(f"\t *  - `{", ".join(insn_format) if len(insn_format) != 0 else '[empty]'}`\n")

                    f.write("\t *\n")
                    f.write(f"\t * Stack: `{insn["stack"].replace("\n", "\n\t * ")}`\n")
                    f.write("\t */\n")
                    f.write(f"\t{insn_variant['name'].upper()} = {hex(insn_variant['value'])},\n")

            f.write("}\n")

    def _generate_access_flags(self, p_input: dict):
        with open(self._source_path("modifier.ts"), "w", encoding="utf-8") as f:
            self._write_header(f)

            f.write("/** JVM access flags. */\n")
            f.write("export enum Modifier {")
            for flag in sorted(p_input["access_flags"], key=(lambda i: i["value"])):
                f.write("\n\t/**\n")
                f.write(f"\t * `{flag['name']}` access flag, integer value `{flag['value']}`.\n")
                f.write("\t *\n")
                f.write("\t * Applicable for:\n")

                for elem, desc in flag["descriptions"].items():
                    replaced_desc = desc.replace("\n", " ")  # don't use newlines here

                    f.write(f"\t *  - `{elem}` - {replaced_desc}\n")

                f.write("\t */\n")
                f.write(f"\t{flag['name'].removeprefix('ACC_')} = {hex(flag['value'])},\n")

            f.write("}\n")

    def _generate_attributes(self, p_input: dict):
        with open(self._source_path("attr_type.ts"), "w", encoding="utf-8") as f:
            self._write_header(f)

            f.write("/** ClassFile attribute names. */\n")
            f.write("export enum AttributeType {")
            for attr in p_input["attributes"]:
                f.write("\n\t/**\n")
                f.write(f"\t * `{attr['name']}` attribute.\n")
                f.write("\t *\n")
                f.write(f"\t * Since: {attr['version']['major']}.{attr['version']['minor']} "
                        f"(Java {attr['version']['java']})\n")
                f.write("\t */\n")
                f.write(f"\t{to_upper_snake(attr['name'])} = \"{attr['name']}\",\n")

            f.write("}\n")

    def _generate_pool_tags(self, p_input: dict):
        with open(self._source_path("const_type.ts"), "w", encoding="utf-8") as f:
            self._write_header(f)

            f.write("/** ClassFile constant pool tags. */\n")
            f.write("export enum ConstantType {")
            for tag in p_input["pool_tags"]:
                f.write("\n\t/**\n")
                f.write(f"\t * `{tag['name']}` tag.\n")
                f.write("\t *\n")
                f.write(f"\t * Since: {tag['version']['major']}.{tag['version']['minor']} "
                        f"(Java {tag['version']['java']})\n")
                f.write("\t */\n")
                f.write(f"\t{to_upper_snake(tag['name'].removeprefix('CONSTANT_'))} = {tag['value']},\n")

            f.write("}\n")

    def _generate_pool_handle_kinds(self, p_input: dict):
        with open(self._source_path("handle_kind.ts"), "w", encoding="utf-8") as f:
            self._write_header(f)

            f.write("/** Constant pool method handle kinds. */\n")
            f.write("export enum HandleKind {")
            for kind in p_input["pool_handle_kinds"]:
                f.write("\n\t/**\n")
                f.write(f"\t * `{kind['name']}` handle kind.\n")
                f.write("\t *\n")
                f.write(f"\t * Interpreted as: `{kind['interpretation']}`\n")
                f.write("\t */\n")
                f.write(f"\t{to_upper_snake(kind['name'].removeprefix('REF_'))} = {kind['value']},\n")

            f.write("}\n")

    def _generate_array_codes(self, p_input: dict):
        with open(self._source_path("array_code.ts"), "w", encoding="utf-8") as f:
            self._write_header(f)

            f.write("/** Array type codes. */\n")
            f.write("export enum ArrayCode {")
            for code in p_input["array_codes"]:
                f.write(f"\n\t/** `{code['name']}` array type code. */\n")
                f.write(f"\t{code['name'].removeprefix('T_')} = {code['value']},\n")

            f.write("}\n")

    def _generate_index(self):
        with open(self._source_path("index.ts"), "w", encoding="utf-8") as f:
            self._write_header(f)

            for file, members in Generator.MEMBERS.items():
                f.write(f"import {{ {', '.join(members)} }} from \"{file}\";\n")
            f.write(f"\nexport {{ {', '.join([m for mm in Generator.MEMBERS.values() for m in mm])} }};\n")

    def generate(self, p_input: dict):
        self._generate_opcodes(p_input)
        self._generate_access_flags(p_input)
        self._generate_attributes(p_input)
        self._generate_pool_tags(p_input)
        self._generate_pool_handle_kinds(p_input)
        self._generate_array_codes(p_input)
        self._generate_index()


if __name__ == "__main__":
    arg_parser = ArgumentParser(description="Generates Java definitions for the JVM instruction set "
                                            "and ClassFile format constructs.")
    arg_parser.add_argument("--input", "-i", help="the file where the parsed specification is stored",
                            default="./generator/spec.json")
    arg_parser.add_argument("--output", "-o", type=dir_path, help="the directory where output is stored",
                            default="./src/spec")

    args = arg_parser.parse_args()

    if not exists(args.output):
        makedirs(args.output)

    if not isfile(args.input):
        eprint(f"Input file {args.input} does not exist!")
        exit(1)

    with open(args.input, "r", encoding="utf-8") as input_file:
        parsed_input = load(input_file)

    Generator(args.output).generate(parsed_input)
