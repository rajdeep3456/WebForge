"use client";

import React, { useEffect, useState } from "react";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { PROMPT } from "@/lib/constant";
import { toast } from "sonner";

const PlayGround = () => {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");

  useEffect(() => {
    frameId && getFrameDetails();
  }, [frameId]);

  const saveGeneratedCode = async (code: string) => {
    await axios.put("/api/frames", {
      designCode: code,
      frameId,
      projectId,
    });
    toast.success("Website is Ready!");
  };

  const getFrameDetails = async () => {
    const result = await axios.get(
      `/api/frames?frameId=${frameId}&projectId=${projectId}`
    );

    // Load the saved design code directly - prepareIframeContent handles sanitization
    const designCode = result.data?.designCode || "";
    setGeneratedCode(designCode);

    if (result.data?.chatMessages?.length === 1) {
      const userMsg = result.data?.chatMessages[0]?.content;
      sendMessage(userMsg);
    } else {
      setMessages(result.data?.chatMessages || []);
    }
  };

  const sendMessage = async (userInput: string) => {
    setLoading(true);
    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    // Reset generated code for new generation
    setGeneratedCode("");

    let result;
    try {
      result = await fetch("/api/ai-model", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            { role: "user", content: PROMPT.replace("{userInput}", userInput) },
          ],
        }),
      });
    } catch (err: any) {
      toast.error("Failed to connect to the AI service. " + err.message);
      setLoading(false);
      return;
    }

    if (!result.ok) {
      try {
        const errJson = await result.json();
        toast.error(errJson.error || "Failed to generate website.");
      } catch {
        toast.error(`Error: Server returned status code ${result.status}`);
      }
      setLoading(false);
      return;
    }

    const reader = result.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    let aiResponse = "";
    let isCode = false;

    while (true) {
      //@ts-ignore
      const { value, done } = await reader?.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      aiResponse += chunk;

      // Check if response is sending code
      if (!isCode && aiResponse.includes("```html")) {
        isCode = true;
        const index = aiResponse.indexOf("```html") + 7;
        const initialCodeChunk = aiResponse.slice(index);
        setGeneratedCode(initialCodeChunk);
      } else if (isCode) {
        setGeneratedCode((prev) => prev + chunk);
      }
    }

    // Extract clean code from the AI response (strip code fences and any surrounding text)
    let cleanCode = aiResponse;
    if (isCode) {
      const htmlStart = aiResponse.indexOf("```html");
      if (htmlStart !== -1) {
        cleanCode = aiResponse.slice(htmlStart + 7);
      }
      const closingFence = cleanCode.lastIndexOf("```");
      if (closingFence !== -1) {
        cleanCode = cleanCode.slice(0, closingFence);
      }
      cleanCode = cleanCode.trim();
      // Update generatedCode with the final clean version
      setGeneratedCode(cleanCode);
    }

    await saveGeneratedCode(cleanCode);

    // After streaming ends
    if (!isCode) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Your code is ready" },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (messages?.length > 0 && !loading) {
      saveMessages();
    }
  }, [messages, loading]);

  const saveMessages = async () => {
    await axios.put("/api/chats", { messages, frameId });
  };

  return (
    <div className="max-h-screen overflow-hidden">
      <PlaygroundHeader />

      <div className="flex h-[(calc(100vh-3.5rem)]">
        {/* Chat section */}
        <ChatSection
          messages={messages ?? []}
          loading={loading}
          onSend={(input: string) => sendMessage(input)}
        />

        {/* Website design - i pass raw code, and prepareIframeContent handles sanitization */}
        <WebsiteDesign generatedCode={generatedCode} />
      </div>
    </div>
  );
};

export default PlayGround;
