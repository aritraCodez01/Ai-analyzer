import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const error = queryParams.get('error');
        const errorDescription = queryParams.get('error_description');

        if (error || errorDescription) {
            console.error('OAuth Error:', error, errorDescription);
            navigate('/', { replace: true });
        }
    }, [location, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                    queryParams: {
                        prompt: 'select_account',
                    },
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen w-full mesh-gradient flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-float"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] overflow-hidden glass z-10">
                {/* Left Side - Visual */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-indigo-600/20 to-purple-600/20 border-r border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <Sparkles className="text-indigo-600 w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">ResumeAI</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold leading-tight text-white font-['Outfit']">
                            Master your <br />
                            <span className="text-indigo-400">career</span> with <br />
                            AI precision.
                        </h1>
                        <p className="text-white/60 text-lg max-w-sm">
                            Analyze your resume against any job description and optimize for ATS success instantly.
                        </p>
                    </div>

                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm overflow-hidden ring-4 ring-black/20">
                                <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="User" />
                            </div>
                        ))}
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/20 bg-indigo-600 text-white text-xs font-bold ring-4 ring-black/20">
                            +5k
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center bg-black/40">
                    <div className="mb-10 lg:hidden flex items-center gap-2">
                        <Sparkles className="text-indigo-500 w-6 h-6" />
                        <span className="text-xl font-bold text-white font-['Outfit']">ResumeAI</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2 font-['Outfit']">Welcome Back</h2>
                        <p className="text-white/50 text-base font-medium">Log in to analyze your resume</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
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

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-white/70 text-sm font-medium">Password</label>
                                <Link to="/forgot-password" title="reset password" className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="px-4 bg-transparent text-white/30 font-bold">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1">
                        <button
                            onClick={handleGoogleLogin}
                            className="flex items-center justify-center gap-3 py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </button>
                    </div>

                    <p className="mt-10 text-center text-white/40 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-white hover:text-indigo-400 font-bold transition-colors">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
