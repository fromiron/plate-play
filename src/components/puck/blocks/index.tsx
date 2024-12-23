import * as layout from "./layout";
import * as typography from "./typography";

export const Components = {
  ...layout,
  ...typography,
};

export const ComponentNames = {
  layout: Object.keys(layout),
  typography: Object.keys(typography),
};
