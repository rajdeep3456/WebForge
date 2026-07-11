"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Download,
  Monitor,
  SquareArrowOutUpRightIcon,
  TabletSmartphone,
} from "lucide-react";
import ViewCodeBlock from "./ViewCodeBlock";

type Props = {
  selectedScreenSize: string;
  setSelectedScreenSize: (screenSize: string) => void;
  currentHtml: string;
  onViewInNewTab: () => void;
  onDownload: () => void;
};

const WebPageTools = ({
  selectedScreenSize,
  setSelectedScreenSize,
  currentHtml,
  onViewInNewTab,
  onDownload,
}: Props) => {
  return (
    <div className="p-2 shadow rounded-xl flex justify-between items-center w-full">
      <div className="flex gap-2">
        <Button
          className={cn(
            selectedScreenSize === "web" && "border border-primary"
          )}
          variant={"ghost"}
          onClick={() => setSelectedScreenSize("web")}
        >
          <Monitor />
        </Button>
        <Button
          className={cn(
            selectedScreenSize === "mobile" && "border border-primary"
          )}
          variant={"ghost"}
          onClick={() => setSelectedScreenSize("mobile")}
        >
          <TabletSmartphone />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant={"outline"} onClick={onViewInNewTab}>
          View <SquareArrowOutUpRightIcon />
        </Button>
        <ViewCodeBlock code={currentHtml} />
        <Button onClick={onDownload}>
          Download <Download />
        </Button>
      </div>
    </div>
  );
};

export default WebPageTools;
