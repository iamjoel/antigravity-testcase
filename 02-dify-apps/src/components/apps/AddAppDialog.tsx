"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

export function AddAppDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [icon, setIcon] = useState('🤖'); // Default emoji

  const addApp = useAppStore((state) => state.addApp);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !apiKey) return;

    addApp({
      id: uuidv4(),
      name,
      apiKey,
      icon,
    });

    setOpen(false);
    setName('');
    setApiKey('');
    setIcon('🤖');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add App</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Chatbot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Chatbot" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input id="apiKey" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="app-..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Emoji)</Label>
            <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🤖" className="w-16 text-center text-2xl" />
          </div>
          <DialogFooter>
            <Button type="submit">Add App</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
