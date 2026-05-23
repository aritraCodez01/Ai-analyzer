import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) throw updateError;

            setMessage('Password updated successfully. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full mesh-gradient flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-float"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-[450px] w-full rounded-[2rem] overflow-hidden glass z-10 p-8 md:p-12 flex flex-col justify-center bg-black/40">
                <div className="mb-8 flex items-center justify-center gap-2">
                    <img src="/vite.svg" className="w-6 h-6" alt="ResumeAI Logo" />
                    <span className="text-xl font-bold text-white font-['Outfit']">ResumeAI</span>
                </div>

                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2 font-['Outfit']">New Password</h2>
                    <p className="text-white/50 text-sm font-medium">Create a strong password for your account</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                        {message}
                    </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-white/70 text-sm font-medium ml-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-white/70 text-sm font-medium ml-1">Confirm New Password</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!message}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : message ? 'Redirecting...' : (
                            <>
                                Reset Password
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
