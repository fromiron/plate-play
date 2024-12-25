import { ComponentNames, Components } from "@/components/puck/blocks";
import type { ComponentConfig, Config } from "@measured/puck";

type ExtractProps<T> = T extends ComponentConfig<infer P> ? P : never;

type Props = {
  [K in keyof typeof Components]: ExtractProps<(typeof Components)[K]>;
};

export const config: Config<Props> = {
  categories: {
    typography: {
      components: [...ComponentNames.typography] as (keyof typeof Components)[],
    },
    layout: {
      components: [...ComponentNames.layout] as (keyof typeof Components)[],
    },
    base: {
      components: [...ComponentNames.base] as (keyof typeof Components)[],
    },
  },
  components: {
    ...Components,
  },
};

export default config;
