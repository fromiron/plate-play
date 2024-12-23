import * as layout from "./layout";
import * as typography from "./typography";
import * as base from "./base";

export const Components = {
  ...layout,
  ...typography,
  ...base,
};

export const ComponentNames = {
  layout: Object.keys(layout),
  typography: Object.keys(typography),
  base: Object.keys(base),
};
