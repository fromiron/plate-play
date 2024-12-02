import type { Config } from "@measured/puck";

type Props = {
  HeadingBlock: { title: string; textAlign: string; textColor: string };
  SubTitleBlock: { title: string };
};

export const config: Config<Props> = {
  components: {
    HeadingBlock: {
      fields: {
        title: { type: "text" },
        textAlign: {
          type: "select",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        textColor: {
          type: "select",
          options: [
            { label: "Black", value: "text-black" },
            { label: "Primary", value: "text-primary" },
            { label: "Secondary", value: "text-secondary" },
          ],
        },
      },
      defaultProps: {
        title: "Heading",
        textAlign: "left",
        textColor: "text-black",
      },
      render: ({ title }) => (
        <div style={{ padding: 64, fontSize: 64 }}>
          <h1>{title}</h1>
        </div>
      ),
    },
    SubTitleBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "SubTitle",
      },
      render: ({ title }) => (
        <div className="p-16 text-black text-gray-500">
          <h1>{title}</h1>
        </div>
      ),
    },
  },
};

export default config;
