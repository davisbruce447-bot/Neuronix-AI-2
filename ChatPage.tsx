
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Model, Message, MessageSender, Page, Plan, ChatHistoryItem } from './types';
import { useAuth } from './App';
import { AI_MODELS } from './constants';
import { generateResponse } from './services/openRouterService';
import { supabase } from './services/supabaseClient';
import { AttachmentIcon, SendIcon, NewChatIcon } from './components/icons';

// --- SUB-COMPONENTS ---

interface SidebarProps {
    selectedModel: Model;
    setSelectedModel: (model: Model) => void;
    userPlan: Plan;
    onUpgrade: () => void;
    history: ChatHistoryItem[];
    onNewChat: () => void;
    onSelectChat: (chatId: string) => void;
    currentChatId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedModel, setSelectedModel, userPlan, onUpgrade, history, onNewChat, onSelectChat, currentChatId }) => {
    const isProUser = userPlan === Plan.Pro;

    const handleModelClick = (model: Model) => {
        if (model.isPro && !isProUser) {
            onUpgrade();
        } else {
            setSelectedModel(model);
        }
    };
    
    return (
        <aside className="w-64 p-4 flex-shrink-0 glass-card flex flex-col">
            <button 
                onClick={onNewChat}
                className="flex items-center justify-center w-full px-4 py-2 mb-6 text-sm font-semibold text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
                <NewChatIcon />
                New Chat
            </button>
            <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">All Models</h2>
            <div className="space-y-2">
                {AI_MODELS.map(model => {
                    const isLocked = model.isPro && !isProUser;
                    const isSelected = selectedModel.id === model.id;

                    if (isLocked) {
                        return (
                             <button 
                                key={model.id}
                                onClick={() => handleModelClick(model)}
                                className="w-full flex items-center p-3 text-left text-gray-400 hover:bg-white/5 transition-colors rounded-lg"
                                aria-label={`Upgrade to Pro to use ${model.name}`}
                            >
                                <span className="mr-3 flex items-center justify-center opacity-60">{model.icon}</span>
                                <span className="font-medium flex-grow">{model.name}</span>
                                <span className="text-xs font-bold text-purple-400">PRO</span>
                            </button>
                        );
                    }

                    return (
                        <button 
                            key={model.id}
                            onClick={() => handleModelClick(model)}
                            className={`w-full flex items-center p-3 rounded-lg text-left transition-all ${isSelected ? 'bg-purple-600 ring-2 ring-white/80' : 'bg-purple-800 hover:bg-purple-700'}`}
                        >
                            <span className="mr-3">{model.icon}</span>
                            <span className="font-medium text-white">{model.name}</span>
                        </button>
                    );
                })}
            </div>
            <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mt-6 mb-4">History</h2>
            <div className="flex-grow space-y-1 overflow-y-auto">
                {history.map(chat => (
                    <button 
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-full text-left text-sm p-2 rounded truncate transition-colors ${currentChatId === chat.id ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10'}`}
                        title={chat.title}
                    >
                        {chat.title}
                    </button>
                ))}
            </div>
        </aside>
    );
};

interface MessageCardProps {
    message: Message;
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
    const isUser = message.sender === MessageSender.User;
    const cardStyle = {
        boxShadow: !isUser && message.model ? `0 0 15px -2px ${message.model.glowColor}` : 'none',
    };

    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`w-full max-w-2xl p-4 rounded-xl glass-card ${isUser ? 'bg-blue-500/20' : ''}`} style={cardStyle}>
                {!isUser && message.model && (
                     <div className="flex items-center mb-2">
                        {message.model.icon}
                        <span className="ml-2 font-semibold text-gray-300">{message.model.name}</span>
                    </div>
                )}
                <p className="text-white whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
};

interface ChatAreaProps {
    messages: Message[];
    isLoading: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-grow p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
                {messages.map(msg => <MessageCard key={msg.id} message={msg} />)}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="p-4 rounded-xl glass-card">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={scrollRef}></div>
            </div>
        </div>
    );
};

interface InputBarProps {
    onSendMessage: (prompt: string) => void;
    isLoading: boolean;
    limitReached: boolean;
    onUpgrade: () => void;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading, limitReached, onUpgrade }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading && !limitReached) {
            onSendMessage(prompt.trim());
            setPrompt('');
        }
    };

    if (limitReached) {
        return (
             <div className="flex-shrink-0 p-4 max-w-4xl mx-auto w-full">
                <div className="glass-card rounded-xl p-4 text-center">
                    <p className="text-yellow-400">Daily limit reached.</p>
                    <button onClick={onUpgrade} className="text-blue-400 hover:underline">Upgrade to Pro for unlimited access.</button>
                </div>
             </div>
        )
    }

    return (
        <div className="flex-shrink-0 p-4 max-w-4xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <AttachmentIcon />
                </div>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Type your message here..."
                    disabled={isLoading}
                    className="w-full pl-12 pr-14 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-white"
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};

// --- MAIN CHAT PAGE COMPONENT ---

const ChatPage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
    const { user, decrementCredits, isReady } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedModel, setSelectedModel] = useState<Model>(AI_MODELS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<ChatHistoryItem[]>([]);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);

    const limitReached = isReady && user?.plan === Plan.Free && user?.credits <= 0;

    useEffect(() => {
        if (!user) {
           setPage('login');
        }
    }, [user, setPage]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('chats')
                .select('id, title')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching chat history:', error);
            else setHistory(data || []);
        };
        fetchHistory();
    }, [user]);

    const handleNewChat = () => {
        setCurrentChatId(null);
        setMessages([]);
    };

    const handleSelectChat = async (chatId: string) => {
        setCurrentChatId(chatId);
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });
        
        if (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } else {
            const loadedMessages = data.map(msg => ({
                id: msg.id,
                text: msg.content,
                sender: msg.sender as MessageSender,
                model: AI_MODELS.find(m => m.id === msg.model_id)
            }));
            setMessages(loadedMessages);
        }
    };

    const handleSendMessage = useCallback(async (prompt: string) => {
        if (limitReached || !user) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            text: prompt,
            sender: MessageSender.User,
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            let chatId = currentChatId;
            if (!chatId) {
                const { data: newChat, error: newChatError } = await supabase
                    .from('chats')
                    .insert({ user_id: user.id, title: prompt.substring(0, 40) + (prompt.length > 40 ? '...' : '') })
                    .select('id, title')
                    .single();
                if (newChatError) throw newChatError;
                chatId = newChat.id;
                setCurrentChatId(chatId);
                setHistory(prev => [newChat, ...prev]);
            }

            await supabase.from('messages').insert({
                chat_id: chatId, user_id: user.id, sender: MessageSender.User, content: prompt
            });

            const aiResponseText = await generateResponse(selectedModel.id, prompt);
            
            await supabase.from('messages').insert({
                chat_id: chatId, user_id: user.id, sender: MessageSender.AI, content: aiResponseText, model_id: selectedModel.id
            });
            
            const aiMessage: Message = {
                id: `ai-${Date.now()}`, text: aiResponseText, sender: MessageSender.AI, model: selectedModel,
            };
            setMessages(prev => [...prev, aiMessage]);

            if (user.plan === Plan.Free) {
                decrementCredits();
            }
        } catch (error) {
            console.error("Error in send message flow:", error);
            const errorMessage: Message = {
                id: `err-${Date.now()}`,
                text: error instanceof Error ? error.message : "Sorry, something went wrong. Please try again.",
                sender: MessageSender.AI, model: selectedModel
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [decrementCredits, limitReached, selectedModel, user, currentChatId]);

    if (!user) return null;

    return (
        <div className="flex h-screen pt-16">
            <Sidebar 
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                userPlan={user.plan}
                onUpgrade={() => setPage('upgrade')}
                history={history}
                onNewChat={handleNewChat}
                onSelectChat={handleSelectChat}
                currentChatId={currentChatId}
            />
            <div className="flex-grow flex flex-col bg-black/30">
                <ChatArea messages={messages} isLoading={isLoading} />
                <InputBar 
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    limitReached={limitReached}
                    onUpgrade={() => setPage('upgrade')}
                />
            </div>
        </div>
    );
};

export default ChatPage;
