
import React from 'react';

export const NeuronixLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChatGPTIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.284 10.373C21.284 6.333 18.01 3 13.91 3C9.81 3 6.535 6.333 6.535 10.373C6.535 12.039 7.12 13.561 8.077 14.773L6.535 17.587L9.622 16.592C10.893 17.205 12.35 17.546 13.91 17.546C15.932 17.546 17.768 16.822 19.165 15.653C19.165 17.546 16.74 19.09 13.91 19.09C11.08 19.09 8.655 17.546 8.655 15.653H8.34C8.34 18.17 10.893 20.2 13.91 20.2C16.927 20.2 19.48 18.17 19.48 15.653C20.573 14.441 21.284 12.505 21.284 10.373ZM13.91 4.109C17.388 4.109 20.129 6.84 20.129 10.373C20.129 13.906 17.388 16.637 13.91 16.637C13.018 16.637 12.169 16.452 11.41 16.128L11.139 16.017L10.337 16.244L8.161 16.925L9.019 14.93L9.173 14.564L8.945 14.283C8.161 13.245 7.69 11.859 7.69 10.373C7.69 6.84 10.431 4.109 13.91 4.109Z" fill="#74A89A"/>
    </svg>
);

export const GeminiIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.132 3.868L12 15.604L18.868 3.868L12 12.868L5.132 3.868Z" fill="#8E44AD"/>
        <path d="M3.868 5.132L12 12L3.868 18.868L11.132 12L3.868 5.132Z" fill="#8E44AD"/>
        <path d="M5.132 20.132L12 8.396L18.868 20.132L12 11.132L5.132 20.132Z" fill="#8E44AD"/>
        <path d="M20.132 5.132L12 12L20.132 18.868L12.868 12L20.132 5.132Z" fill="#8E44AD"/>
    </svg>
);

export const ClaudeIcon = () => <span className="text-2xl font-bold text-orange-400">C</span>;
export const GrokIcon = () => <span className="text-2xl font-bold text-blue-800">G</span>;
export const MistralIcon = () => <span className="text-2xl font-bold text-red-500">M</span>;
export const LlamaIcon = () => <span className="text-2xl font-bold text-pink-400">L</span>;

export const AttachmentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
);

export const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
    </svg>
);

export const NewChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);
