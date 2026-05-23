import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Send, AlertCircle, Loader2, Sparkles, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { API_BASE_URL } from '../lib/api';

const Analyze = () => {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [jd, setJd] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !jd) {
            setError('Please provide both a resume and a job description.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('job_description', jd);
            formData.append('user_id', user?.id || '');
            formData.append('email', user?.email || '');

            const response = await fetch(`${API_BASE_URL}/api/v1/resumes/analyze`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Analysis failed');
            }

            const data = await response.json();
            setResult(data.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full mesh-gradient text-white p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="p-8 rounded-3xl glass flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Sparkles className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-['Outfit'] tracking-tight">AI Resume Engine</h1>
                            <p className="text-white/40 text-sm font-medium">Identify gaps and optimize your career path</p>
                        </div>
                    </div>

                    <Link to="/dashboard">
                        <button className="px-6 py-3 border border-white/10 hover:bg-white/5 rounded-xl font-bold transition-all flex items-center gap-2 group">
                            <LayoutDashboard className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                            Dashboard
                        </button>
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {!result ? (
                    <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* File Upload */}
                        <div className="p-8 rounded-3xl glass space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-lg font-bold font-['Outfit']">Upload Resume</h2>
                            </div>

                            <div
                                className={`h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all ${file ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const droppedFile = e.dataTransfer.files[0];
                                    if (droppedFile) setFile(droppedFile);
                                }}
                            >
                                {file ? (
                                    <>
                                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
                                            <FileText className="text-white w-8 h-8" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold">{file.name}</p>
                                            <p className="text-xs text-white/40">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFile(null)}
                                            className="text-xs text-red-400 hover:text-red-300 font-bold"
                                        >
                                            Change File
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                            <Upload className="text-white/20 w-8 h-8" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold">Drag & drop or <span className="text-indigo-400 cursor-pointer">browse</span></p>
                                            <p className="text-xs text-white/40">Support for PDF and DOCX (Max 5MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.docx"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            id="resume-upload"
                                        />
                                        <label htmlFor="resume-upload" className="absolute inset-x-0 inset-y-0 cursor-pointer"></label>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* JD Input */}
                        <div className="p-8 rounded-3xl glass space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Send className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-lg font-bold font-['Outfit']">Job Description</h2>
                            </div>
                            <textarea
                                className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-medium text-white/80 placeholder:text-white/10"
                                placeholder="Paste the job description here..."
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                            ></textarea>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing Patterns...
                                    </>
                                ) : (
                                    <>
                                        Get ATS Score
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Results View */
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 p-8 rounded-3xl glass flex flex-col items-center justify-center text-center space-y-4">
                                <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Global ATS Score</p>
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="64" cy="64" r="60"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-white/5"
                                        />
                                        <circle
                                            cx="64" cy="64" r="60"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={377}
                                            strokeDashoffset={377 * (1 - result.score / 100)}
                                            className="text-indigo-500 transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <span className="absolute text-4xl font-black font-['Outfit']">{Math.round(result.score)}</span>
                                </div>
                                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${result.match_level === 'Excellent' ? 'bg-green-500/20 text-green-400' :
                                    result.match_level === 'Good' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-yellow-500/20 text-yellow-500'
                                    }`}>
                                    {result.match_level} Match
                                </div>
                                {result.is_passed && (
                                    <div className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 mt-2">
                                        PASSED
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2 p-8 rounded-3xl glass space-y-6">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-indigo-400" />
                                    <h2 className="text-lg font-bold font-['Outfit']">Skill Gap Analysis</h2>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {result.missing_skills.map((skill: string, i: number) => (
                                        <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-white/40 italic">
                                    Include these keywords in your resume to improve your ATS compatibility for this specific role.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                onClick={() => setResult(null)}
                                className="flex-1 py-4 border border-white/10 hover:bg-white/5 rounded-2xl font-bold transition-all"
                            >
                                Analyze Another Resume
                            </button>
                            <Link to="/dashboard" className="flex-1">
                                <button className="w-full py-4 bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 text-indigo-400 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group">
                                    <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Go to Dashboard
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analyze;
