import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Square, Trash2 } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { LLMParameters } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  parameters: LLMParameters;
}

export const ChatInterface = ({ parameters }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);
    setCurrentResponse("");

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("https://bullsai.fun/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // llama.cpp compatible format
          messages: [
            { role: "system", content: parameters.system_prompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMessage.content }
          ],
          temperature: parameters.temperature,
          max_tokens: parameters.max_tokens,
          top_p: parameters.top_p,
          top_k: parameters.top_k,
          repeat_penalty: parameters.repeat_penalty,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullResponse += content;
                  setCurrentResponse(fullResponse);
                }
              } catch (e) {
                // Skip malformed JSON chunks
                continue;
              }
            }
          }
        }
      }

      // Add the complete response as a message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fullResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentResponse("");

    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast({
          title: "Request cancelled",
          description: "The response was stopped by user.",
        });
      } else {
        console.error("Streaming error:", error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to the LLM API. Please check your connection and try again.",
          variant: "destructive",
        });
      }
      setCurrentResponse("");
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setCurrentResponse("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Send className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium">Start a conversation</h3>
                  <p className="text-muted-foreground">
                    Type your message below to test the LLM
                  </p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Streaming Response */}
            {isStreaming && currentResponse && (
              <ChatMessage
                message={{
                  id: "streaming",
                  role: "assistant",
                  content: currentResponse,
                  timestamp: new Date(),
                }}
                isStreaming={true}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/50 p-4 flex-shrink-0">
        <div className="flex gap-2 mb-2">
          {messages.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              className="ml-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex flex-col gap-2">
            {isStreaming ? (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={handleStop}
                className="h-[60px] w-[60px]"
              >
                <Square className="h-5 w-5" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                size="icon"
                disabled={!input.trim()}
                className="h-[60px] w-[60px] glow"
              >
                <Send className="h-5 w-5" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};