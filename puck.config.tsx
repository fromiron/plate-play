import type { ComponentConfig, Config } from "@measured/puck";
import * as Components from "@/components/puck/blocks/index";

type ExtractProps<T> = T extends ComponentConfig<infer P> ? P : never;

type Props = {
  [K in keyof typeof Components]: ExtractProps<(typeof Components)[K]>;
};

export const config: Config<Props> = {
  categories: {
    typography: {
      components: ["TextBlock"],
    },
    layout: {
      components: ["VerticalSpacer"],
    },
  },
  components: {
    ...Components,
  },
};

export default config;
