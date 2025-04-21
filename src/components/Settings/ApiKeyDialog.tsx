
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export const ApiKeyDialog = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('deepseek_api_key') || '');

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('deepseek_api_key', apiKey.trim());
      toast.success("API key saved successfully");
    } else {
      localStorage.removeItem('deepseek_api_key');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              DeepSeek API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your DeepSeek API key"
            />
            <p className="text-xs text-muted-foreground">
              Your API key will be stored locally in your browser.
            </p>
          </div>
          <Button onClick={handleSave}>Save API Key</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
