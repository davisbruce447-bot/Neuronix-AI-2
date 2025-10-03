
import React, { useState } from 'react';
import { supabase } from './services/supabaseClient';
import { Page } from './types';

interface LoginPageProps {
    setPage: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let response;
            if (isSignUp) {
                response = await supabase.auth.signUp({ email, password });
            } else {
                response = await supabase.auth.signInWithPassword({ email, password });
            }
            
            if (response.error) throw response.error;
            
            if (isSignUp) {
                alert('Check your email for the confirmation link!');
            } else {
                setPage('chat'); // On successful login, go to chat
            }

        } catch (err: any) {
            setError(err.error_description || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-sm p-8 rounded-2xl glass-card">
                <h2 className="text-3xl font-bold text-white text-center text-glow mb-6">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all transform hover:scale-105 glow-shadow-blue disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>
                <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="w-full mt-4 text-gray-400 hover:text-white transition">
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
