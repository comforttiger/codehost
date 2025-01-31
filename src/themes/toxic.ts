import { Theme, colorStyle, hsl, lch } from "./util";

const hue = {
  main: 250,
  uno: 85,
  due: 180,
  tre: 30,
} as const;

export const ui = {
  bg0: hsl(hue.main, 40, 20),
  bg1: hsl(hue.main, 40, 15),

  fg: hsl(hue.main, 100, 90),

  border0: hsl(hue.main, 40, 35),
  border1: hsl(hue.main, 40, 60),

  bracket1: lch(65, 48, hue.uno),
  bracket2: lch(65, 32, hue.due),
  bracket3: lch(65, 31, hue.tre),
} as const;

const syntax = {
  default: ui.fg,
  alt0: hsl(hue.main, 15, 60),
  alt1: hsl(hue.main, 85, 75),

  uno0: hsl(hue.uno, 65, 75),
  uno1: hsl(hue.uno, 85, 45),

  due0: hsl(hue.due, 90, 80),
  due1: hsl(hue.due, 90, 45),
  due2: hsl(hue.due, 90, 35),

  tre0: hsl(hue.tre, 100, 80),
  tre1: hsl(hue.tre, 100, 70),
  tre2: hsl(hue.tre, 100, 60),
} as const;

const colors = {
  fg: colorStyle(syntax.default),
  comment: colorStyle(syntax.alt0),
  punctuation: colorStyle(syntax.alt1),
  string: colorStyle(syntax.tre1),
  number: colorStyle(syntax.tre0),
  unit: colorStyle(syntax.tre2),
  property: colorStyle(syntax.uno0),
  selector: colorStyle(syntax.due1),
  operator: colorStyle(syntax.alt1),
  function: colorStyle(syntax.due0),
  class: colorStyle(syntax.due1),
  keyword: colorStyle(syntax.uno1),
} as const;

export const theme: Theme = {
  _meta: {
    name: "Toxic",
    id: "toxic",
  },

  _root: {
    "box-sizing": "border-box",
    padding: "0.75rem",
    margin: "1.25rem -0.75rem",
    "border-radius": "0",
    "line-height": "1.5",
    "overflow-x": "auto",
    background: ui.bg0,
    color: syntax.default,
    "color-scheme": "dark",
    "scrollbar-color": `${ui.fg} ${ui.bg1}`,
  },

  _footer: {
    margin: "-0.75rem",
    marginTop: "-1.25rem",
    marginBottom: "1.25rem",
    padding: "0.25rem 0.5rem",
    fontSize: "smaller",
    textAlign: "right",
    background: ui.bg1,
    color: ui.fg,
  },

  script: colors.fg,

  comment: colors.comment,
  prolog: colors.comment,
  doctype: colors.comment,
  cdata: colors.comment,

  punctuation: colors.punctuation,

  "attr-value": colors.string,
  string: colors.string,
  char: colors.string,
  inserted: colors.string,

  number: colors.number,
  hexcode: colors.number,
  regex: colors.number,

  unit: colors.unit,

  operator: colors.operator,
  entity: colors.operator,
  url: colors.operator,

  atrule: colors.function,
  "attr-name": colors.function,
  function: colors.function,

  "class-name": colors.class,

  tag: colors.keyword,
  selector: colors.selector,
  keyword: colors.keyword,
  rule: colors.keyword,

  property: colors.property,
  constant: colors.property,

  symbol: colors.property,
  deleted: colors.property,
  boolean: colors.property,
  important: colors.property,
};
