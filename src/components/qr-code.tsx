"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useRef, type FC } from "react";
import { Button } from "./ui/button";

interface QRCodeProps {
  url: string;
}

export const QRCode: FC<QRCodeProps> = ({ url }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const handleDownload = () => {
    console.log("download", qrRef.current);
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrcode.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="flex h-[200px] w-[200px] flex-col items-center justify-center pt-8">
      <div ref={qrRef}>
        <QRCodeCanvas
          value={url}
          size={128}
          bgColor={"#fff"}
          fgColor={"#000"}
          level={"L"}
          //   imageSettings={{
          //     src: "/favicon.ico",
          //     x: undefined,
          //     y: undefined,
          //     height: 24,
          //     width: 24,
          //     excavate: true,
          //   }}
        />
      </div>
      <Button
        onClick={handleDownload}
        className="mb-4 mt-2 w-full max-w-32"
        variant="ghost"
      >
        QRCodeを保存
      </Button>
    </div>
  );
};
