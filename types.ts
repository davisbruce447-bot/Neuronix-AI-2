
// FIX: Import React to provide the JSX namespace for JSX.Element.
import React from 'react';

export enum Plan {
  Free = 'Free',
  Pro = 'Pro',
}

export type User = {
  id: string; // Supabase user ID
  email?: string;
  plan: Plan;
  credits: number;
  last_credit_reset: string;
};

export type Model = {
  id: string;
  name: string;
  // FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
  glowColor: string;
  isPro?: boolean;
};

export enum MessageSender {
    User = 'user',
    AI = 'ai',
}

export type Message = {
    id: string;
    text: string;
    sender: MessageSender;
    model?: Model;
};

export type Page = 'landing' | 'chat' | 'upgrade' | 'login';

export type ChatHistoryItem = {
    id: string;
    title: string;
};
