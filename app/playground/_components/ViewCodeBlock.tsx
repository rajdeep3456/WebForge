import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Code, Copy } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "sonner";

const ViewCodeBlock = ({ code }: { code: string }) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    toast.success("Code Copied!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          View <Code />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-5xl 2xl:max-w-7xl overflow-auto max-h-[94vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Source Code</span>
            <Button onClick={handleCopy}>
              <Copy />
            </Button>
          </DialogTitle>
          <DialogDescription asChild>
            <SyntaxHighlighter
              style={docco}
              // showLineNumbers={true}
            >
              {code}
            </SyntaxHighlighter>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCodeBlock;
