"use client";

import { Button } from "@/components/ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import { suggestions } from "@/lib/constant";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { ArrowUp, ImagePlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState, useTransition } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const generateRandomFrameNumber = () => {
  const number = Math.floor(Math.random() * 10000);
  return number;
};

const Hero = () => {
  const [userInput, setUserInput] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const { has } = useAuth();

  const hasUnlimitedAccess = has && has({ plan: "unlimited" });

  const createNewProject = async () => {
    if (!hasUnlimitedAccess && userDetail?.credits! <= 0) {
      toast.error("You have no credits left. Please upgrade your plan.");
      return;
    }

    const projectId = uuidv4();
    const frameId = generateRandomFrameNumber();
    const messages = [
      {
        role: "user",
        content: userInput,
      },
    ];

    try {
      const result = await axios.post("/api/projects", {
        projectId,
        frameId,
        messages,
        credits: userDetail?.credits,
      });

      console.log(result.data);
      toast.success("Project created successfully");

      // navigate to playground
      router.push(`/playground/${projectId}?frameId=${frameId}`);
      setUserDetail((prev: any) => prev ? { ...prev, credits: (prev.credits ?? 0) - 1 } : prev);
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    }
  };

  const handleSubmit = () => {
    if (!userInput || isPending) return;

    startTransition(async () => {
      await createNewProject();
    });
  };

  return (
    <div className="flex flex-col items-center md:justify-center md:h-screen">
      {/* Header & description  */}
      <h2 className="uppercase text-center font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
        What should we design?
      </h2>
      <p className="mt-2 px-5 text-center text-sm sm:text-lg 2xl:text-xl text-gray-500">
        Generate, Edit and Explore design with AI. Export your code as well
      </p>

      {/* input box  */}
      <div className="w-full max-w-[340px] sm:max-w-sm md:max-w-xl xl:max-w-2xl p-5 border mt-5 rounded-2xl">
        <textarea
          placeholder="Describe your page design"
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          className="w-full h-24 focus:outline-none focus:ring-0 resize-none"
        />
        <div className="flex justify-between items-center">
          <Button variant={"ghost"}>
            <ImagePlus />
          </Button>

          {!user ? (
            <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
              <Button disabled={!userInput}>
                <ArrowUp />
              </Button>
            </SignInButton>
          ) : (
            <Button disabled={!userInput || isPending} onClick={handleSubmit}>
              {isPending ? <Loader2 className="animate-spin" /> : <ArrowUp />}
            </Button>
          )}
        </div>
      </div>

      {/* suggestion list  */}
      <div className="mt-4 flex flex-wrap justify-center items-center gap-3">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant={"outline"}
            onClick={() => setUserInput(suggestion.prompt)}
          >
            {suggestion.icon && <suggestion.icon />}
            {suggestion.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
