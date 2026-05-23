import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                    },
                },
            });

            if (authError) throw authError;

            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full mesh-gradient flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-float"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] overflow-hidden glass z-10">
                {/* Left Side - Visual */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-blue-600/20 to-indigo-600/20 border-r border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
                            <img src="/vite.svg" className="w-6 h-6" alt="ResumeAI Logo" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">ResumeAI</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold leading-tight text-white font-['Outfit']">
                            Unlock your <br />
                            <span className="text-blue-400">potential</span> with <br />
                            AI parsing.
                        </h1>
                        <p className="text-white/60 text-lg max-w-sm">
                            Create your account and start generating high-impact resume analytics today.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-white/70">
                            <CheckCircle2 className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-medium">ATS Score Prediction</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/70">
                            <CheckCircle2 className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-medium">Skill Gap Identification</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/70">
                            <CheckCircle2 className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-medium">Unlimited Resume Checks</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center bg-black/40">
                    <div className="mb-10 lg:hidden flex items-center gap-2">
                        <img src="/vite.svg" className="w-6 h-6" alt="ResumeAI Logo" />
                        <span className="text-xl font-bold text-white font-['Outfit']">ResumeAI</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2 font-['Outfit']">Create Account</h2>
                        <p className="text-white/50 text-base font-medium">Join our community today</p>
                    </div>

                    {success ? (
                        <div className="space-y-6 text-center py-8">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white font-['Outfit']">Account Created!</h3>
                            <p className="text-white/60">Kindly check your email to verify your account.</p>
                            <p className="text-white/40 text-sm italic">Redirecting you to the login page...</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSignup} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-white/70 text-sm font-medium ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                            placeholder="user name"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-white/70 text-sm font-medium ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                            placeholder="name@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-white/70 text-sm font-medium ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                >
                                    {loading ? 'Creating account...' : (
                                        <>
                                            Create Account
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="mt-10 text-center text-white/40 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-white hover:text-blue-400 font-bold transition-colors">Sign In</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signup;
