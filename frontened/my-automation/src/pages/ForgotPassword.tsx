import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { API_BASE_URL } from '../lib/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Check if email exists in our local DB first
            const checkRes = await fetch(`${API_BASE_URL}/api/v1/resumes/check-email/${email}`);
            const checkData = await checkRes.json();

            if (checkData.status === 'success' && !checkData.exists) {
                setError('Email is not registered. Kindly create an account first.');
                setLoading(false);
                return;
            }

            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) {
                if (resetError.message.toLowerCase().includes('not found') || resetError.status === 422) {
                    setError('Email is not registered. Kindly create an account first.');
                } else {
                    setError(resetError.message);
                }
                return;
            }

            setMessage('Check your email for the password reset link.');
        } catch (err: any) {
            setError('An error occurred. Please try again.');
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
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/login" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/70">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-indigo-500 w-6 h-6" />
                        <span className="text-xl font-bold text-white font-['Outfit']">ResumeAI</span>
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2 font-['Outfit']">Reset Password</h2>
                    <p className="text-white/50 text-sm font-medium">Enter your email to receive a reset link</p>
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

                <form onSubmit={handleResetRequest} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-white/70 text-sm font-medium ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="email"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!message}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                    >
                        {loading ? 'Sending link...' : message ? 'Email Sent' : (
                            <>
                                Send Reset Link
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-10 text-center text-white/40 text-sm">
                    Remember your password?{' '}
                    <Link to="/login" className="text-white hover:text-indigo-400 font-bold transition-colors">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
