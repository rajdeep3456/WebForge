"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Crop,
  Image as ImageUpscale,
  ImageMinus,
  Loader,
  Images,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ImageKit from "imagekit";
import type { SelectedElementInfo } from "./WebsiteDesign";

type Props = {
  elementInfo: SelectedElementInfo;
  setAttribute: (property: string, value: string) => void;
  applyStyle: (property: string, value: string) => void;
};

const transformOptions = [
  {
    label: "Smart Crop",
    value: "smartcrop",
    icon: <Crop />,
    transformation: "fo-auto",
  },
  {
    label: "Drop shadow",
    value: "dropshadow",
    icon: <Images />,
    transformation: "e-dropshadow",
  },
  {
    label: "Upscale",
    value: "upscale",
    icon: <ImageUpscale />,
    transformation: "e-upscale",
  },
  {
    label: "BG Remove",
    value: "bgremove",
    icon: <ImageMinus />,
    transformation: "e-bgremove",
  },
];

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
});

function ImageSettings({ elementInfo, setAttribute, applyStyle }: Props) {
  const [altText, setAltText] = useState(elementInfo.alt || "");
  const [preview, setPreview] = useState(elementInfo.src || "");
  const [borderRadius, setBorderRadius] = useState(
    elementInfo.computedStyle?.borderRadius || "0px"
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Update preview when element changes
  useEffect(() => {
    setPreview(elementInfo.src || "");
    setAltText(elementInfo.alt || "");
  }, [elementInfo.src, elementInfo.alt]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveUploadedFile = async () => {
    setLoading(true);
    if (selectedImage) {
      try {
        const imageRef = await imagekit.upload({
          //@ts-ignore
          file: selectedImage,
          fileName: Date.now() + ".png",
          isPublished: true,
        });

        //@ts-ignore
        const newUrl = imageRef?.url + "?tr=";
        setPreview(newUrl);
        setAttribute("src", newUrl);
        setSelectedImage(null);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
    setLoading(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const generateAiImage = () => {
    if (!altText.trim()) return;
    setLoading(true);
    const url = `https://ik.imagekit.io/7ywthbsojd/ikmedia/ik-genimg-prompt-${encodeURIComponent(
      altText
    )}/${Date.now()}.png?tr=`;
    setPreview(url);
    setAttribute("src", url);
    setAttribute("alt", altText);
  };

  const applyTransformation = (trValue: string) => {
    setLoading(true);

    let newUrl: string;
    if (!preview.includes(trValue)) {
      newUrl = preview + trValue + ",";
    } else {
      newUrl = preview.replace(trValue + ",", "").replace(trValue, "");
    }
    setPreview(newUrl);
    setAttribute("src", newUrl);
  };

  const handleBorderRadiusChange = (value: string) => {
    setBorderRadius(value);
    applyStyle("borderRadius", value);
  };

  const handleAltChange = (value: string) => {
    setAltText(value);
    setAttribute("alt", value);
  };

  return (
    <div className="w-96 shadow p-4 space-y-4 overflow-auto h-[90vh] rounded-xl mt-2 mr-2">
      <div className="flex items-center justify-between">
        <h2 className="flex gap-2 items-center font-bold">
          <ImageIcon /> Image Settings
        </h2>
      </div>

      {/* Preview (clickable) */}
      <div className="flex justify-center">
        <img
          src={preview}
          alt={altText}
          className="max-h-40 object-contain border rounded cursor-pointer hover:opacity-80 transition-opacity"
          onClick={openFileDialog}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={saveUploadedFile}
        disabled={!selectedImage || loading}
      >
        {loading && <Loader className="animate-spin mr-2" />}
        Upload Image
      </Button>

      {/* Alt text / Prompt */}
      <div>
        <label className="text-sm">Prompt / Alt Text</label>
        <Input
          type="text"
          value={altText}
          onChange={(e) => handleAltChange(e.target.value)}
          placeholder="Enter image description"
          className="mt-1"
        />
      </div>

      <Button
        className="w-full"
        onClick={generateAiImage}
        disabled={loading || !altText.trim()}
      >
        {loading && <Loader className="animate-spin mr-2" />}
        Generate AI Image
      </Button>

      {/* Transform Buttons */}
      <div>
        <label className="text-sm mb-1 block">AI Transform</label>
        <div className="flex gap-2 flex-wrap">
          <TooltipProvider>
            {transformOptions.map((opt) => (
              <Tooltip key={opt.value}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={
                      preview.includes(opt.transformation)
                        ? "default"
                        : "outline"
                    }
                    className="flex items-center justify-center p-2"
                    onClick={() => applyTransformation(opt.transformation)}
                    disabled={loading}
                  >
                    {opt.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {opt.label}{" "}
                  {preview.includes(opt.transformation) && "(Applied)"}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <label className="text-sm">Border Radius</label>
        <Input
          type="text"
          value={borderRadius}
          onChange={(e) => handleBorderRadiusChange(e.target.value)}
          placeholder="e.g. 8px or 50%"
          className="mt-1"
        />
      </div>
    </div>
  );
}

export default ImageSettings;
