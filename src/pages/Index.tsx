import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { ParameterPanel } from "@/components/ParameterPanel";
import { Brain, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LLMParameters {
  temperature: number;
  max_tokens: number;
  top_p: number;
  top_k: number;
  repeat_penalty: number;
  system_prompt: string;
}

const Index = () => {
  const [showParams, setShowParams] = useState(false);
  const [parameters, setParameters] = useState<LLMParameters>({
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 0.9,
    top_k: 40,
    repeat_penalty: 1.1,
    system_prompt: "You are a helpful AI assistant. Be concise and accurate in your responses."
  });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Parameter Panel */}
      <div className={`${showParams ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-border`}>
        <ParameterPanel 
          parameters={parameters}
          onParametersChange={setParameters}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="glass border-b border-border/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowParams(!showParams)}
              className="hover:bg-muted/50"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold gradient-text">
                LLM Tester
              </h1>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            llama.cpp @ bullsai.fun
          </div>
        </header>

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface parameters={parameters} />
        </div>
      </div>
    </div>
  );
};

export default Index;