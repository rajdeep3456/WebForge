"use client";

import { useContext, useEffect, useRef, useState, useCallback } from "react";
import WebPageTools from "./WebPageTools";
import { cn } from "@/lib/utils";
import { prepareIframeContent } from "@/lib/prepareIframeContent";
import ElementSettings from "./ElementSettings";
import ImageSettings from "./ImageSettings";
import { OnSaveContext } from "@/context/OnSaveContext";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useSearchParams } from "next/navigation";

// Type for element info received from iframe
export type SelectedElementInfo = {
  tagName: string;
  path: string;
  innerText: string;
  innerHTML: string;
  src: string | null;
  alt: string | null;
  className: string;
  computedStyle: {
    fontSize: string;
    color: string;
    backgroundColor: string;
    textAlign: string;
    padding: string;
    margin: string;
    borderRadius: string;
  };
};

type Props = {
  generatedCode: string;
};

function WebsiteDesign({ generatedCode }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedScreenSize, setSelectedScreenSize] = useState("web");
  const { onSaveData, setSaveLoading } = useContext(OnSaveContext);
  const [selectedElement, setSelectedElement] =
    useState<SelectedElementInfo | null>(null);
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");

  // Track the current HTML content (for view in new tab / download)
  const [currentHtml, setCurrentHtml] = useState<string>("");
  const pendingActionRef = useRef<"save" | "view" | "download" | null>(null);

  // Send command to iframe
  const sendToIframe = useCallback((message: Record<string, unknown>) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, "*");
    }
  }, []);

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data || {};

      if (type === "ELEMENT_SELECTED") {
        setSelectedElement(event.data as SelectedElementInfo);
      }

      if (type === "ELEMENT_DESELECTED") {
        setSelectedElement(null);
      }

      if (type === "HTML_CONTENT") {
        const html = event.data.html;
        setCurrentHtml(html);

        // Handle the pending action
        if (pendingActionRef.current === "save") {
          saveHtmlToServer(html);
        } else if (pendingActionRef.current === "view") {
          openInNewTab(html);
        } else if (pendingActionRef.current === "download") {
          downloadHtml(html);
        }
        pendingActionRef.current = null;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Update iframe content when generated code changes
  useEffect(() => {
    if (!iframeRef.current) return;

    const content = prepareIframeContent(generatedCode);
    iframeRef.current.srcdoc = content;
    setCurrentHtml(content); // Initialize currentHtml with prepared content

    // Clear selection when code changes
    setSelectedElement(null);
  }, [generatedCode]);

  // Handle save trigger from context
  useEffect(() => {
    if (onSaveData) {
      pendingActionRef.current = "save";
      sendToIframe({ type: "GET_HTML" });
    }
  }, [onSaveData, sendToIframe]);

  const saveHtmlToServer = async (html: string) => {
    setSaveLoading(true);
    try {
      await axios.put("/api/frames", {
        designCode: html,
        frameId,
        projectId,
      });
      setSaveLoading(false);
      toast.success("Changes Saved!");
    } catch (e) {
      console.error("Save failed:", e);
      toast.error("Failed to save changes");
    }
  };

  const openInNewTab = (html: string) => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const downloadHtml = (html: string) => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "index.html";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Request current HTML from iframe for view/download
  const requestCurrentHtml = useCallback(
    (action: "view" | "download") => {
      pendingActionRef.current = action;
      sendToIframe({ type: "GET_HTML" });
    },
    [sendToIframe]
  );

  // Functions to send style/attribute changes to iframe
  const applyStyle = useCallback(
    (property: string, value: string) => {
      if (selectedElement?.path) {
        sendToIframe({
          type: "APPLY_STYLE",
          path: selectedElement.path,
          property,
          value,
        });
      }
    },
    [selectedElement?.path, sendToIframe]
  );

  const setAttribute = useCallback(
    (property: string, value: string) => {
      if (selectedElement?.path) {
        sendToIframe({
          type: "SET_ATTRIBUTE",
          path: selectedElement.path,
          property,
          value,
        });
      }
    },
    [selectedElement?.path, sendToIframe]
  );

  const setClassName = useCallback(
    (value: string) => {
      if (selectedElement?.path) {
        sendToIframe({
          type: "SET_CLASS",
          path: selectedElement.path,
          value,
        });
      }
    },
    [selectedElement?.path, sendToIframe]
  );

  const clearSelection = useCallback(() => {
    sendToIframe({ type: "DESELECT" });
    setSelectedElement(null);
  }, [sendToIframe]);

  return (
    <div className="flex gap-2 w-full">
      <div className="p-4 w-full flex items-center flex-col">
        <iframe
          ref={iframeRef}
          className={cn(
            selectedScreenSize === "web" ? "w-full" : "w-[400px]",
            "h-[500px] 2xl:h-[600px] border-2 rounded-xl"
          )}
          sandbox="allow-scripts allow-same-origin"
        />

        <WebPageTools
          selectedScreenSize={selectedScreenSize}
          setSelectedScreenSize={setSelectedScreenSize}
          currentHtml={currentHtml}
          onViewInNewTab={() => requestCurrentHtml("view")}
          onDownload={() => requestCurrentHtml("download")}
        />
      </div>

      {/* settings section  */}
      {selectedElement?.tagName === "IMG" ? (
        <ImageSettings
          elementInfo={selectedElement}
          setAttribute={setAttribute}
          applyStyle={applyStyle}
        />
      ) : selectedElement ? (
        <ElementSettings
          elementInfo={selectedElement}
          applyStyle={applyStyle}
          setClassName={setClassName}
          clearSelection={clearSelection}
        />
      ) : null}
    </div>
  );
}

export default WebsiteDesign;
