import { Button } from "@/components/ui/button";
import { OnSaveContext } from "@/context/OnSaveContext";
import Image from "next/image";
import { useContext } from "react";

const PlaygroundHeader = () => {
  const { saveLoading, setOnSaveData } = useContext(OnSaveContext);

  return (
    <div className="flex w-full justify-between items-center h-14 px-4 shadow">
      <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
      <Button onClick={() => setOnSaveData(Date.now())} disabled={saveLoading}>
        {saveLoading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default PlaygroundHeader;
