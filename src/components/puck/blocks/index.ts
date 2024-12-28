import * as layout from "./layout";
import * as typography from "./typography";
import * as base from "./base";
import * as containers from "./containers";

export const Components = {
  ...layout,
  ...typography,
  ...base,
  ...containers,
};

export const ComponentNames = {
  layout: Object.keys(layout),
  typography: Object.keys(typography),
  base: Object.keys(base),
  containers: Object.keys(containers),
};
