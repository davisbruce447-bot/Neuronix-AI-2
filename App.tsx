
import React, { useState, createContext, useContext, useEffect } from 'react';
import { Plan, User, Page } from './types';
import { FREE_PLAN_CREDITS, PRO_PLAN_PRICE } from './constants';
import ChatPage from './ChatPage';
import LoginPage from './LoginPage';
import { NeuronixLogo } from './components/icons';
import { supabase } from './services/supabaseClient';
import type { Session } from '@supabase/supabase-js';

// --- AUTH CONTEXT ---
interface AuthContextType {
    user: User | null;
    session: Session | null;
    upgradeToPro: () => Promise<void>;
    decrementCredits: () => Promise<void>;
    isReady: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session?.user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching profile:', error);
                    setUser(null);
                } else if (data) {
                    const now = Date.now();
                    const oneDay = 24 * 60 * 60 * 1000;
                    if (data.plan === Plan.Free && now - new Date(data.last_credit_reset).getTime() > oneDay) {
                        const { data: updatedProfile, error: updateError } = await supabase
                            .from('profiles')
                            .update({ credits: FREE_PLAN_CREDITS, last_credit_reset: new Date().toISOString() })
                            .eq('id', session.user.id)
                            .select()
                            .single();
                        if (updateError) console.error("Error resetting credits:", updateError);
                        else setUser({ ...updatedProfile, email: session.user.email });
                    } else {
                        setUser({ ...data, email: session.user.email });
                    }
                }
            } else {
                setUser(null);
            }
            if(!isReady) setIsReady(true);
        });

        return () => subscription.unsubscribe();
    }, [isReady]);

    const upgradeToPro = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('profiles')
            .update({ plan: Plan.Pro, credits: Infinity })
            .eq('id', user.id)
            .select()
            .single();
        if (error) console.error("Error upgrading to pro:", error);
        else setUser({ ...data, email: user.email });
    };

    const decrementCredits = async () => {
        if (!user || user.plan !== Plan.Free) return;
        const newCredits = Math.max(0, user.credits - 1);
        const { data, error } = await supabase
            .from('profiles')
            .update({ credits: newCredits })
            .eq('id', user.id)
            .select()
            .single();
         if (error) console.error("Error decrementing credits:", error);
         else setUser({ ...data, email: user.email });
    };
    
    const signOut = async () => {
        await supabase.auth.signOut();
        // The onAuthStateChange listener will handle setting user to null
    };

    const value = { user, session, upgradeToPro, decrementCredits, isReady, signOut };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// --- UI COMPONENTS ---

const Navbar: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
    const { user, signOut } = useAuth();

    const handleAuthClick = () => {
        if (user) {
            signOut().then(() => setPage('landing'));
        } else {
            setPage('login');
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4 glass-card border-b-0 rounded-none">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setPage('landing')}>
                    <NeuronixLogo />
                    <h1 className="text-xl font-bold text-white text-glow">Neuronix AI</h1>
                </div>
                <button 
                    onClick={handleAuthClick}
                    className="px-4 py-2 text-sm font-semibold text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    {user ? 'Logout' : 'Login'}
                </button>
            </div>
        </nav>
    );
};

const Hero: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
     const { user } = useAuth();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-5xl md:text-7xl font-black text-white text-glow mb-4">
                Neuronix AI
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8">
                Unlock 6 Models Forever for just ₨{PRO_PLAN_PRICE}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                    onClick={() => user ? setPage('chat') : setPage('login')}
                    className="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all transform hover:scale-105 glow-shadow-blue"
                >
                    Start Chatting
                </button>
                <button
                    onClick={() => setPage('upgrade')}
                    className="px-8 py-4 text-lg font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-500 transition-all transform hover:scale-105 glow-shadow-purple"
                >
                    Upgrade to Pro
                </button>
            </div>
        </div>
    );
};

const UpgradePage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
    const { upgradeToPro } = useAuth();

    const handleUpgrade = () => {
        upgradeToPro().then(() => {
            alert("Congratulations! You've upgraded to Neuronix Pro with lifetime access.");
            setPage('chat');
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md p-8 text-center rounded-2xl glass-card">
                <h2 className="text-3xl font-bold text-white text-glow mb-2">Neuronix Pro</h2>
                <p className="text-purple-300 mb-6">Lifetime Access</p>
                <p className="text-5xl font-black text-white mb-6">
                    ₨{PRO_PLAN_PRICE}
                </p>
                <ul className="text-left text-gray-300 space-y-2 mb-8">
                    <li className="flex items-center">✓ Lifetime access to all features</li>
                    <li className="flex items-center">✓ Unlimited chats</li>
                    <li className="flex items-center">✓ Access to all 6 AI models</li>
                    <li className="flex items-center">✓ Priority support</li>
                </ul>
                <button onClick={handleUpgrade} className="w-full px-8 py-4 text-lg font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-500 transition-all transform hover:scale-105 glow-shadow-purple">
                    Upgrade Now
                </button>
                 <button onClick={() => setPage('chat')} className="w-full mt-4 text-gray-400 hover:text-white transition">
                    Maybe later
                </button>
            </div>
        </div>
    );
};

// --- MAIN APP ---

const AppContent: React.FC = () => {
    const [page, setPage] = useState<Page>('landing');
    const { isReady } = useAuth();

    if (!isReady) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    const renderPage = () => {
        switch (page) {
            case 'chat':
                return <ChatPage setPage={setPage} />;
            case 'upgrade':
                return <UpgradePage setPage={setPage} />;
            case 'login':
                return <LoginPage setPage={setPage} />;
            case 'landing':
            default:
                return <Hero setPage={setPage} />;
        }
    };
    
    return (
        <div className="bg-black text-white min-h-screen hero-bg">
            <Navbar setPage={setPage} />
            <main>
                {renderPage()}
            </main>
        </div>
    );
}


function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
