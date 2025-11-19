"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore, AppType } from "@/store/useAppStore";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

export function AddAppDialog() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AppType>('dify');

  // Common fields
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🤖');

  // Dify fields
  const [difyApiKey, setDifyApiKey] = useState('');

  // Model fields
  const [modelProvider, setModelProvider] = useState('openai');
  const [modelName, setModelName] = useState('gpt-4o');
  const [systemPrompt, setSystemPrompt] = useState('');

  const addApp = useAppStore((state) => state.addApp);

  const [hasEnvKey, setHasEnvKey] = useState(false);

  React.useEffect(() => {
    import('@/app/actions/check-env').then(({ checkOpenAIKey }) => {
      checkOpenAIKey().then(setHasEnvKey);
    });
  }, []);

  const handleModelChange = (value: string) => {
    setModelName(value);
    // Auto-fill name if empty or if it matches a known model name
    if (!name || ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'].includes(name)) {
      setName(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'dify') {
      if (!name || !difyApiKey) return;
      addApp({
        id: uuidv4(),
        name,
        icon,
        apiKey: difyApiKey,
        type: 'dify',
      });
    } else {
      if (!name) return;
      addApp({
        id: uuidv4(),
        name,
        icon,
        apiKey: '', // Always empty, relying on server-side env key
        type: 'model',
        modelConfig: {
          provider: modelProvider,
          model: modelName,
          systemPrompt,
        },
      });
    }

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setIcon('🤖');
    setDifyApiKey('');
    setSystemPrompt('');
    setActiveTab('dify');
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-transparent">
          <Plus className="h-6 w-6 text-black hover:scale-110 transition-transform" />
          <span className="sr-only">Add App</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-4 border-black shadow-[8px_8px_0px_0px_#000000] bg-white p-0 gap-0">
        <DialogHeader className="p-6 border-b-4 border-black bg-secondary">
          <DialogTitle className="text-2xl font-black uppercase tracking-wide text-black">Add New Chatbot</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as AppType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-white border-2 border-black p-0 gap-0 rounded-none shadow-[4px_4px_0px_0px_#000000] mb-6">
              <TabsTrigger
                value="dify"
                className="h-full rounded-none border-r-2 border-black data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-sm uppercase transition-none"
              >
                Dify App
              </TabsTrigger>
              <TabsTrigger
                value="model"
                className="h-full rounded-none data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-sm uppercase transition-none"
              >
                Model App
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold uppercase text-xs tracking-wider">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="MY CHATBOT"
                  required
                  className="border-2 border-black shadow-[4px_4px_0px_0px_#000000] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon" className="font-bold uppercase text-xs tracking-wider">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="🤖"
                  className="w-20 text-center text-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000000] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <TabsContent value="dify" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="difyApiKey" className="font-bold uppercase text-xs tracking-wider">Dify API Key</Label>
                  <Input
                    id="difyApiKey"
                    value={difyApiKey}
                    onChange={(e) => setDifyApiKey(e.target.value)}
                    placeholder="app-..."
                    required={activeTab === 'dify'}
                    className="border-2 border-black shadow-[4px_4px_0px_0px_#000000] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm"
                  />
                </div>
              </TabsContent>

              <TabsContent value="model" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-xs tracking-wider">Model</Label>
                  <Select value={modelName} onValueChange={handleModelChange}>
                    <SelectTrigger className="border-2 border-black shadow-[4px_4px_0px_0px_#000000] rounded-none focus:ring-0 focus:ring-offset-0 font-medium">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-black shadow-[4px_4px_0px_0px_#000000] rounded-none">
                      <SelectItem value="gpt-4o" className="focus:bg-secondary focus:text-black font-medium">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4-turbo" className="focus:bg-secondary focus:text-black font-medium">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo" className="focus:bg-secondary focus:text-black font-medium">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!hasEnvKey && (
                  <div className="p-3 bg-yellow-100 border-2 border-black shadow-[4px_4px_0px_0px_#000000] text-sm font-bold text-black">
                    WARNING: OPENAI_API_KEY MISSING
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt" className="font-bold uppercase text-xs tracking-wider">System Prompt (Optional)</Label>
                  <Textarea
                    id="systemPrompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="You are a helpful assistant..."
                    className="h-24 border-2 border-black shadow-[4px_4px_0px_0px_#000000] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none font-medium"
                  />
                </div>
              </TabsContent>

              <DialogFooter className="mt-8">
                <Button
                  type="submit"
                  className="w-full border-2 border-black shadow-[4px_4px_0px_0px_#000000] rounded-none bg-primary text-black hover:bg-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase tracking-wider text-lg h-12"
                >
                  Add App
                </Button>
              </DialogFooter>
            </form>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
