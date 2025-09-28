from argparse import ArgumentParser
from urllib.request import urlopen
from json import dump
from re import compile, Match, MULTILINE
from bs4 import BeautifulSoup
from lib.utils import eprint

WS_PATTERN = compile(r"\s{2,}", MULTILINE)
INSN_FORM_PATTERN = compile(r"^([a-z_<>\d]+) = (\d+) \((0x[\da-f]{1,2})\)$")


def get(url: str) -> str:
    with urlopen(url) as r:
        return r.read().decode("utf-8")


def html_parser(s: str) -> BeautifulSoup:
    return BeautifulSoup(s, "html.parser")


def _replace_ws(m: Match) -> str:
    if "\n" in m.group(0):
        return "\n"

    return " "


def collapse_whitespace(s: str) -> str:
    replaced_str = WS_PATTERN.sub(" ", s)
    if len(replaced_str) <= 100:
        return replaced_str

    return WS_PATTERN.sub(_replace_ws, s)


class Parser:
    def __init__(self):
        pass

    @staticmethod
    def _find_anchored_element(soup: BeautifulSoup, anchor: str):
        return soup.find("a", attrs={"name": anchor}).parent

    def _parse_table(self, soup: BeautifulSoup, anchor: str) -> list[list[str]]:
        rows = []

        table_body = self._find_anchored_element(soup, anchor).find("tbody")
        for row in table_body.find_all("tr"):
            rows.append([" ".join([s.strip() for s in e.text.strip().split("\n")]) for e in row.find_all("td")])

        return rows

    def _parse_pool_tags(self, soup: BeautifulSoup) -> list:
        results = []

        # Table 4.4-B. Constant pool tags (by tag)
        for row in self._parse_table(soup, "jvms-4.4-210"):
            (major, minor) = row[2].split(".", maxsplit=1)

            results.append({
                "name": row[0],
                "value": int(row[1]),
                "version": {
                    "major": int(major),
                    "minor": int(minor),
                    "java": row[3]
                }
            })

        return results

    def _parse_pool_handle_kinds(self, soup: BeautifulSoup) -> list:
        results = []

        # Table 5.4.3.5-A. Bytecode Behaviors for Method Handles
        for row in self._parse_table(soup, "jvms-5.4.3.5-220"):
            results.append({
                "value": int(row[0]),
                "name": row[1],
                "interpretation": row[2]
            })

        return results

    def _parse_attributes(self, soup: BeautifulSoup) -> list:
        results = []

        # Table 4.7-A. Predefined class file attributes (by section)
        for row in self._parse_table(soup, "jvms-4.7-300"):
            (major, minor) = row[2].split(".", maxsplit=1)

            results.append({
                "name": row[0],
                "section": row[1],
                "version": {
                    "major": int(major),
                    "minor": int(minor),
                    "java": row[3]
                }
            })

        return results

    def _parse_access_flags(self, soup: BeautifulSoup, anchors: dict) -> list:
        results = {}

        for name, anchor in anchors.items():
            table_body = self._find_anchored_element(soup, anchor).find("tbody")
            for row in table_body.find_all("tr"):
                cols = [e.text.strip() for e in row.find_all("td")]

                value_int = int(cols[1], 16)  # hexadecimal
                if cols[0] not in results:
                    results[cols[0]] = {
                        "name": cols[0],
                        "value": value_int,
                        "descriptions": {}
                    }

                obj = results[cols[0]]
                if obj["value"] != value_int:
                    eprint(f"Already parsed {cols[0]} for {', '.join(obj['descriptions'].keys())} ({obj['value']}), "
                           f"but {cols[0]} has value {value_int}")

                obj["descriptions"][name] = collapse_whitespace(cols[2])

        return list(results.values())

    def _parse_array_codes(self, soup: BeautifulSoup) -> list:
        results = []

        # Table 6.5.newarray-A. Array type codes
        for row in self._parse_table(soup, "jvms-6.5.newarray.desc-120"):
            results.append({
                "name": row[0],
                "value": int(row[1])
            })

        return results

    def _parse_insns(self, soup: BeautifulSoup) -> list:
        results = []

        # 6.5. Instructions
        section_body = self._find_anchored_element(soup, "jvms-6.5").find_parent(attrs={"class": "section"})
        for insn_section in section_body.find_all(attrs={"class": "section-execution"}):
            insn_name = insn_section.find("h3", attrs={"class": "title"}).text.strip()
            result = {
                "name": insn_name
            }

            for insn_subsection in insn_section.find_all(attrs={"class": "section"}):
                section_name = insn_subsection.find("h4", attrs={"class": "title"}).text.strip()
                if section_name == "Operation":
                    result["operation"] = collapse_whitespace(
                        insn_subsection.find(attrs={"class": "norm"}).text.strip()
                    )
                elif section_name == "Description":
                    result["description"] = collapse_whitespace("\n".join([
                        e.text.strip() for e in insn_subsection.find_all(attrs={"class": ["norm", "norm-dynamic"]})
                    ]))
                elif section_name == "Forms":
                    insn_values = result.setdefault("values", [])
                    for insn_form in insn_subsection.find_all(attrs={"class": "norm"}):
                        insn_form_text = insn_form.text.strip()

                        m = INSN_FORM_PATTERN.fullmatch(insn_form_text)
                        if not m:
                            eprint(f"Did not match pattern in {insn_form_text} of insn {insn_name}")
                            continue

                        insn_values.append({
                            "name": m.group(1),
                            "value": int(m.group(2))
                        })
                elif section_name == "Operand Stack":
                    result["stack"] = collapse_whitespace(" ".join([
                        e.text.strip() for e in insn_subsection.find_all(attrs={"class": "norm"})
                    ]))
                elif section_name.startswith("Format"):  # there can be multiple formats
                    # I don't think I need to collapse any whitespace here?
                    result.setdefault("formats", []).append(
                        # chop off the first one, it's the insn
                        insn_subsection.find(attrs={"class": "literallayout"}).text.strip().split("\n")[1:]
                    )

            results.append(result)

        return results

    def parse(self, url: str) -> dict:
        cf_soup = html_parser(get(f"{url}/jvms-4.html"))
        pool_soup = html_parser(get(f"{url}/jvms-5.html"))
        insn_soup = html_parser(get(f"{url}/jvms-6.html"))

        return {
            "pool_tags": self._parse_pool_tags(cf_soup),
            "pool_handle_kinds": self._parse_pool_handle_kinds(pool_soup),
            "attributes": self._parse_attributes(cf_soup),
            "access_flags": self._parse_access_flags(cf_soup, {
                "class": "jvms-4.1-200-E.1",  # Table 4.1-B. Class access and property modifiers
                "field": "jvms-4.5-200-A.1",  # Table 4.5-A. Field access and property flags
                "method": "jvms-4.6-200-A.1"  # Table 4.6-A. Method access and property flags
            }),
            "array_codes": self._parse_array_codes(insn_soup),
            "insns": self._parse_insns(insn_soup)
        }


if __name__ == "__main__":
    arg_parser = ArgumentParser(description="Parses the JVM instruction set and ClassFile format specification.")
    arg_parser.add_argument("--url", "-u", help="the JVM specification URL",
                            default="https://docs.oracle.com/javase/specs/jvms/se25/html")
    arg_parser.add_argument("--output", "-o", help="the file where the output is stored",
                            default="./generator/spec.json")

    args = arg_parser.parse_args()

    with open(args.output, "w", encoding="utf-8") as f:
        dump(Parser().parse(args.url), f, indent=2)
