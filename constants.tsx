import React from 'react';
import { Model } from './types';
import { ChatGPTIcon, GeminiIcon, ClaudeIcon, GrokIcon, MistralIcon, LlamaIcon } from './components/icons';

export const AI_MODELS: Model[] = [
  { id: 'openai/gpt-4o', name: 'ChatGPT', icon: <ChatGPTIcon />, glowColor: '#74A89A' },
  // FIX: Update deprecated Gemini model to 'gemini-2.5-flash'
  { id: 'google/gemini-2.5-flash', name: 'Gemini', icon: <GeminiIcon />, glowColor: '#8E44AD' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude', icon: <ClaudeIcon />, glowColor: '#D97706' },
  { id: 'xai/grok-1', name: 'Grok', icon: <GrokIcon />, glowColor: '#1E40AF', isPro: true },
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral', icon: <MistralIcon />, glowColor: '#EF4444', isPro: true },
  { id: 'meta-llama/llama-2-70b-chat', name: 'LLaMA', icon: <LlamaIcon />, glowColor: '#F472B6', isPro: true },
];

export const FREE_PLAN_CREDITS = 10;
export const PRO_PLAN_PRICE = 199;