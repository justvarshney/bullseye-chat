import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LLMParameters } from "@/pages/Index";
import { Thermometer, Hash, Percent, RotateCcw, MessageSquare } from "lucide-react";

interface ParameterPanelProps {
  parameters: LLMParameters;
  onParametersChange: (params: LLMParameters) => void;
}

export const ParameterPanel = ({ parameters, onParametersChange }: ParameterPanelProps) => {
  const updateParameter = (key: keyof LLMParameters, value: any) => {
    onParametersChange({
      ...parameters,
      [key]: value,
    });
  };

  return (
    <div className="h-full glass border-r border-border/50 flex flex-col">
      <div className="p-4 border-b border-border/50 flex-shrink-0">
        <h2 className="font-semibold gradient-text">LLM Parameters</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Fine-tune the model behavior
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Temperature */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Thermometer className="h-4 w-4 text-primary" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Slider
                value={[parameters.temperature]}
                onValueChange={([value]) => updateParameter('temperature', value)}
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Focused (0)</span>
                <span className="font-medium">{parameters.temperature}</span>
                <span>Creative (2)</span>
              </div>
            </CardContent>
          </Card>

          {/* Max Tokens */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-primary" />
                Max Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Slider
                value={[parameters.max_tokens]}
                onValueChange={([value]) => updateParameter('max_tokens', value)}
                min={1}
                max={4096}
                step={64}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span className="font-medium">{parameters.max_tokens}</span>
                <span>4096</span>
              </div>
            </CardContent>
          </Card>

          {/* Top P */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Percent className="h-4 w-4 text-primary" />
                Top P
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Slider
                value={[parameters.top_p]}
                onValueChange={([value]) => updateParameter('top_p', value)}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span className="font-medium">{parameters.top_p}</span>
                <span>1</span>
              </div>
            </CardContent>
          </Card>

          {/* Top K */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-secondary" />
                Top K
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Slider
                value={[parameters.top_k]}
                onValueChange={([value]) => updateParameter('top_k', value)}
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span className="font-medium">{parameters.top_k}</span>
                <span>100</span>
              </div>
            </CardContent>
          </Card>

          {/* Repeat Penalty */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-4 w-4 text-warning" />
                Repeat Penalty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Slider
                value={[parameters.repeat_penalty]}
                onValueChange={([value]) => updateParameter('repeat_penalty', value)}
                min={1}
                max={1.5}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span className="font-medium">{parameters.repeat_penalty}</span>
                <span>1.5</span>
              </div>
            </CardContent>
          </Card>

          <Separator className="opacity-50" />

          {/* System Prompt */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-accent" />
                System Prompt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={parameters.system_prompt}
                onChange={(e) => updateParameter('system_prompt', e.target.value)}
                placeholder="Enter system prompt..."
                className="min-h-[120px] resize-none"
              />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};