"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import React, { useState } from "react";

type Props = {
  onSend: (input: string) => void;
  messages: Messages[];
  loading: boolean;
};

const ChatSection = ({ messages, onSend, loading }: Props) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    // send message
    onSend(input);
    setInput("");
  };

  return (
    <div className="w-96 shadow max-h-[(calc(100vh-3.5rem)] p-4 flex flex-col">
      {/* message section  */}
      <div className="overflow-y-auto p-4 space-y-3 max-h-[74vh] flex flex-col">
        {messages?.length === 0 ? (
          <p className="text-center text-gray-400">No messages found</p>
        ) : (
          messages?.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message?.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-[80%] ${
                  message.role === "user"
                    ? "bg-gray-200 text-foreground"
                    : "bg-blue-100 text-foreground"
                }`}
              >
                {message?.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full size-8 border-t-2 border-b-2 border-zinc-800"></div>
            <span className="ml-2 text-zinc-800">Thinking...</span>
          </div>
        )}
      </div>

      {/* footer input  */}
      <div className="p-2 border-t flex items-center gap-2">
        <textarea
          placeholder="Describe your website design idea"
          className=" resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend}>
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
};

export default ChatSection;
