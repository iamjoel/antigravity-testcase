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
  const [modelApiKey, setModelApiKey] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  const addApp = useAppStore((state) => state.addApp);

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
      if (!name || !modelApiKey) return;
      addApp({
        id: uuidv4(),
        name,
        icon,
        apiKey: modelApiKey,
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
    setModelApiKey('');
    setSystemPrompt('');
    setActiveTab('dify');
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add App</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Chatbot</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as AppType)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dify">Dify App</TabsTrigger>
            <TabsTrigger value="model">Model App</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Chatbot" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🤖" className="w-16 text-center text-2xl" />
            </div>

            <TabsContent value="dify" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="difyApiKey">Dify API Key</Label>
                <Input id="difyApiKey" value={difyApiKey} onChange={(e) => setDifyApiKey(e.target.value)} placeholder="app-..." required={activeTab === 'dify'} />
              </div>
            </TabsContent>

            <TabsContent value="model" className="space-y-4">
              <div className="space-y-2">
                <Label>Model</Label>
                <Select value={modelName} onValueChange={setModelName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelApiKey">OpenAI API Key</Label>
                <Input id="modelApiKey" type="password" value={modelApiKey} onChange={(e) => setModelApiKey(e.target.value)} placeholder="sk-..." required={activeTab === 'model'} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt (Optional)</Label>
                <Textarea
                  id="systemPrompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="You are a helpful assistant..."
                  className="h-20"
                />
              </div>
            </TabsContent>

            <DialogFooter>
              <Button type="submit">Add App</Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
