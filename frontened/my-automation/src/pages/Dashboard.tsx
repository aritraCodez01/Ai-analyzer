import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import { Activity, Sparkles, FileText, TrendingUp, BarChart3, Plus, AlertCircle, LogOut } from 'lucide-react'
import { API_BASE_URL } from '../lib/api'


export default function Dashboard() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [analytics, setAnalytics] = useState<any[]>([])

    const handleLogout = async () => {
        try {
            await signOut()
            navigate('/login')
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }
    const [stats, setStats] = useState({
        total: 12,
        avgScore: 78,
        topGap: 'Kubernetes',
        skillGaps: [
            { name: 'React Query', count: 12, percent: 85 },
            { name: 'Docker', count: 8, percent: 65 },
            { name: 'Redis', count: 7, percent: 55 },
            { name: 'GraphQL', count: 5, percent: 45 },
            { name: 'Testing', count: 4, percent: 35 },
        ] as { name: string, count: number, percent: number }[]
    })

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/resumes/analytics/${user?.id}`)
                const data = await response.json()
                if (data.status === 'success') {
                    const results = data.data
                    setAnalytics(results)

                    if (results.length > 0) {
                        const total = results.length
                        const avgScore = results.reduce((sum: number, item: any) => sum + item.ats_score, 0) / total

                        // Calculate skill gaps
                        const gapMap: Record<string, number> = {}
                        results.forEach((item: any) => {
                            if (item.missing_skills) {
                                item.missing_skills.forEach((skill: string) => {
                                    gapMap[skill] = (gapMap[skill] || 0) + 1
                                })
                            }
                        })

                        const sortedGaps = Object.entries(gapMap)
                            .map(([name, count]) => ({
                                name,
                                count,
                                percent: (count / total) * 100
                            }))
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 5)

                        setStats({
                            total,
                            avgScore: Math.round(avgScore),
                            topGap: sortedGaps[0]?.name || 'N/A',
                            skillGaps: sortedGaps
                        })
                    } else {
                        // Reset to dummy if zero results (e.g. after deletion or for new user)
                        setStats({
                            total: 12,
                            avgScore: 78,
                            topGap: 'Kubernetes',
                            skillGaps: [
                                { name: 'React Query', count: 12, percent: 85 },
                                { name: 'Docker', count: 8, percent: 65 },
                                { name: 'Redis', count: 7, percent: 55 },
                                { name: 'GraphQL', count: 5, percent: 45 },
                                { name: 'Testing', count: 4, percent: 35 },
                            ]
                        })
                    }
                }
            } catch (err) {
                console.error('Failed to fetch analytics', err)
            }
        }
        if (user?.id) fetchAnalytics()
    }, [user])

    return (
        <div className="min-h-screen w-full mesh-gradient text-white p-4 md:p-8 font-sans overflow-x-hidden">
            <div className="max-w-7xl mx-auto space-y-8 relative">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-3xl glass gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Sparkles className="text-white w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-['Outfit'] tracking-tight">ResumeAI Analytics</h1>
                            <p className="text-white/40 text-sm font-medium">Tracking your career growth and ATS performance</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/analyze">
                            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20">
                                <Plus className="w-5 h-5" />
                                New Analysis
                            </button>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all font-bold text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Stats & Trends */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Total Analyses', value: stats.total.toString(), sub: 'Lifetime data', icon: FileText },
                                { label: 'Avg ATS Score', value: `${stats.avgScore}%`, sub: 'Across all resumes', icon: TrendingUp },
                                { label: 'Top Skill Gap', value: stats.topGap, sub: 'Most frequent gap', icon: AlertCircle }
                            ].map((stat, i) => (
                                <div key={i} className="p-6 rounded-3xl glass border-white/5 bg-linear-to-br from-white/5 to-transparent">
                                    <stat.icon className="w-5 h-5 text-indigo-400 mb-4" />
                                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <div className="text-3xl font-bold font-['Outfit'] mb-1">{stat.value}</div>
                                    <p className="text-xs text-indigo-400 font-medium">{stat.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Performance Bars (Custom CSS) */}
                        <div className="p-8 rounded-3xl glass space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                                    <h2 className="text-lg font-bold font-['Outfit']">Recent Scores</h2>
                                </div>
                            </div>
                            <div className="h-64 w-full flex items-end gap-2 pt-4">
                                {analytics.length > 0 ? analytics.slice(0, 7).reverse().map((item: any, i: number) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                        <div
                                            className="w-full bg-linear-to-t from-indigo-600 to-indigo-400 rounded-lg transition-all duration-500 hover:brightness-125 relative shadow-lg shadow-indigo-500/10"
                                            style={{ height: `${Math.max(8, item.ats_score)}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                                {Math.round(item.ats_score)}%
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-white/20 font-bold uppercase mt-2">
                                            {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                )) : [65, 72, 68, 85, 92, 88].map((score, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                        <div
                                            className="w-full bg-linear-to-t from-indigo-600/40 to-indigo-400/20 rounded-lg transition-all duration-500 hover:bg-indigo-500 relative"
                                            style={{ height: `${score}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                                {score}%
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-white/20 font-bold uppercase mt-2">Sample {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Skill Gaps Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="p-8 rounded-3xl glass space-y-6 h-full flex flex-col">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-lg font-bold font-['Outfit']">Frequent Gaps</h2>
                            </div>
                            <div className="flex-1 space-y-4">
                                {stats.skillGaps.length > 0 ? stats.skillGaps.map((gap, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-white/60">{gap.name}</span>
                                            <span className="text-indigo-400">{gap.count} hits</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-linear-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000"
                                                style={{ width: `${gap.percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-xs text-white/20 italic">Analyze resumes to see skill gaps</p>
                                )}
                            </div>
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Recommended Focus</h3>
                                <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20">
                                    <p className="text-sm font-medium text-indigo-300">
                                        {stats.topGap !== 'N/A'
                                            ? `Boost your profile by learning ${stats.topGap}.`
                                            : "Start analyzing to get recommendations."}
                                    </p>
                                    {stats.topGap !== 'N/A' && (
                                        <p className="text-[10px] text-indigo-400/60 mt-1">
                                            This is your most frequent missing skill.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Analyses view */}
                <div className="p-8 rounded-3xl glass space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-lg font-bold font-['Outfit']">Recent Analyses</h2>
                        </div>
                        <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">View All</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analytics.length > 0 ? analytics.map((item: any, i: number) => (
                            <div key={i} className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="text-2xl font-black font-['Outfit'] text-indigo-400">{Math.round(item.ats_score)}</div>
                                </div>
                                <h3 className="font-bold text-sm truncate">{item.filename}</h3>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">
                                    {new Date(item.created_at).toLocaleDateString()} • {item.match_level}
                                </p>
                            </div>
                        )) : (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-white/20 italic space-y-4">
                                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                                    <Activity className="w-8 h-8 opacity-20" />
                                </div>
                                <p>No analyses performed yet</p>
                                <Link to="/analyze">
                                    <button className="text-indigo-400 text-sm font-bold hover:underline">Start your first analysis</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
