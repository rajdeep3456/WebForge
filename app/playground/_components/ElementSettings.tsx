"use client";

import { SwatchBook } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignLeft, AlignCenter, AlignRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SelectedElementInfo } from "./WebsiteDesign";

type Props = {
  elementInfo: SelectedElementInfo;
  applyStyle: (property: string, value: string) => void;
  setClassName: (value: string) => void;
  clearSelection: () => void;
};

// Helper to convert rgb to hex
function rgbToHex(rgb: string): string {
  if (!rgb || rgb === "transparent") return "#ffffff";
  if (rgb.startsWith("#")) return rgb;

  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return "#ffffff";

  const [r, g, b] = match.map(Number);
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function ElementSettings({
  elementInfo,
  applyStyle,
  setClassName,
  clearSelection,
}: Props) {
  const [classes, setClasses] = useState<string[]>([]);
  const [newClass, setNewClass] = useState("");
  const [align, setAlign] = useState(
    elementInfo.computedStyle?.textAlign || "left"
  );

  // Initialize classes from element info
  useEffect(() => {
    if (elementInfo?.className) {
      const currentClasses = elementInfo.className
        .split(" ")
        .filter((c) => c.trim() !== "");
      setClasses(currentClasses);
    } else {
      setClasses([]);
    }
  }, [elementInfo?.className]);

  // Update alignment
  useEffect(() => {
    if (align) {
      applyStyle("textAlign", align);
    }
  }, [align]);

  // Remove a class
  const removeClass = (cls: string) => {
    const updated = classes.filter((c) => c !== cls);
    setClasses(updated);
    setClassName(updated.join(" "));
  };

  // Add new class
  const addClass = () => {
    const trimmed = newClass.trim();
    if (!trimmed) return;
    if (!classes.includes(trimmed)) {
      const updated = [...classes, trimmed];
      setClasses(updated);
      setClassName(updated.join(" "));
    }
    setNewClass("");
  };

  return (
    <div className="w-96 shadow p-4 space-y-4 overflow-auto h-[90vh] rounded-xl mt-2 mr-2">
      <div className="flex items-center justify-between">
        <h2 className="flex gap-2 items-center font-bold">
          <SwatchBook /> Settings
        </h2>
        <Button variant="ghost" size="icon" onClick={clearSelection}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
        Selected: <code>{elementInfo.tagName.toLowerCase()}</code>
      </div>

      {/* Font Size + Text Color inline */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-sm">Font Size</label>
          <Select
            defaultValue={elementInfo.computedStyle?.fontSize || "16px"}
            onValueChange={(value) => applyStyle("fontSize", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(53)].map((_, index) => (
                <SelectItem value={index + 12 + "px"} key={index}>
                  {index + 12}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm block">Text Color</label>
          <input
            type="color"
            className="w-[40px] h-[40px] rounded-lg mt-1 cursor-pointer"
            defaultValue={rgbToHex(elementInfo.computedStyle?.color)}
            onChange={(event) => applyStyle("color", event.target.value)}
          />
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="text-sm mb-1 block">Text Alignment</label>
        <ToggleGroup
          type="single"
          value={align}
          onValueChange={(value) => value && setAlign(value)}
          className="bg-gray-100 rounded-lg p-1 inline-flex w-full justify-between"
        >
          <ToggleGroupItem
            value="left"
            className="p-2 rounded hover:bg-gray-200 flex-1"
          >
            <AlignLeft size={20} />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="center"
            className="p-2 rounded hover:bg-gray-200 flex-1"
          >
            <AlignCenter size={20} />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="right"
            className="p-2 rounded hover:bg-gray-200 flex-1"
          >
            <AlignRight size={20} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Background Color + Border Radius inline */}
      <div className="flex items-center gap-4">
        <div>
          <label className="text-sm block">Background</label>
          <input
            type="color"
            className="w-[40px] h-[40px] rounded-lg mt-1 cursor-pointer"
            defaultValue={rgbToHex(elementInfo.computedStyle?.backgroundColor)}
            onChange={(event) =>
              applyStyle("backgroundColor", event.target.value)
            }
          />
        </div>
        <div className="flex-1">
          <label className="text-sm">Border Radius</label>
          <Input
            type="text"
            placeholder="e.g. 8px"
            defaultValue={elementInfo.computedStyle?.borderRadius || ""}
            onChange={(e) => applyStyle("borderRadius", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Padding */}
      <div>
        <label className="text-sm">Padding</label>
        <Input
          type="text"
          placeholder="e.g. 10px 15px"
          defaultValue={elementInfo.computedStyle?.padding || ""}
          onChange={(e) => applyStyle("padding", e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Margin */}
      <div>
        <label className="text-sm">Margin</label>
        <Input
          type="text"
          placeholder="e.g. 10px 15px"
          defaultValue={elementInfo.computedStyle?.margin || ""}
          onChange={(e) => applyStyle("margin", e.target.value)}
          className="mt-1"
        />
      </div>

      {/* === Class Manager === */}
      <div>
        <label className="text-sm font-medium">Classes</label>

        {/* Existing classes as removable chips */}
        <div className="flex flex-wrap gap-2 mt-2">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <span
                key={cls}
                className="flex text-xs items-center gap-1 px-2 py-1 rounded-full bg-gray-100 border"
              >
                {cls}
                <button
                  onClick={() => removeClass(cls)}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No classes applied</span>
          )}
        </div>

        {/* Add new class input */}
        <div className="flex gap-2 mt-3">
          <Input
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            placeholder="Add class..."
            onKeyDown={(e) => e.key === "Enter" && addClass()}
          />
          <Button type="button" onClick={addClass}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ElementSettings;
