import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plate Play",
  description: "多言語対応デジタルメニューボード作成プラットフォーム",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
