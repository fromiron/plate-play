import type {
  FontWeight,
  Padding,
  TextAlign,
  TextSize,
} from "@/constants/styles";

export type TextBlockProps = {
  text: string;
  textAlign: TextAlign;
  textColor: string;
  textSize: TextSize;
  padding: Padding;
  bgColor: string;
  fontWeight: FontWeight;
};
export const TextBlock = (props: TextBlockProps) => {
  const { text, textAlign, textColor, textSize, padding, bgColor, fontWeight } =
    props;
  return (
    <div
      className={`w-full ${textAlign} ${textSize} ${String(padding)} ${fontWeight}`}
      style={{ color: textColor, backgroundColor: bgColor }}
    >
      {text}
    </div>
  );
};
