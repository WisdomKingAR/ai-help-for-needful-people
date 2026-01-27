import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import { Activity, CheckCircle, Search, BarChart3 } from 'lucide-react';

interface Stats {
    totalScans: number;
    issuesFixed: number;
    complianceLevel: string;
    scoreTrend: { name: string; score: number }[];
}

export const Dashboard = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.get('/dashboard/stats');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="min-h-screen pt-24 px-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Accessibility Dashboard</h1>
                        <p className="text-white/60">Real-time monitoring of your digital accessibility impact.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-4">
                        <button className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium hover:bg-primary/20 transition-all">
                            New Scan
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Scans', value: stats.totalScans, icon: <Search className="text-blue-400" /> },
                        { label: 'Issues Fixed', value: stats.issuesFixed, icon: <CheckCircle className="text-green-400" /> },
                        { label: 'Compliance Level', value: stats.complianceLevel, icon: <Activity className="text-purple-400" /> },
                    ].map((item, i) => (
                        <div key={i} className="glass p-6 rounded-3xl border border-white/5 bg-white/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/5 rounded-2xl">{item.icon}</div>
                                <span className="text-white/60 font-medium">{item.label}</span>
                            </div>
                            <div className="text-3xl font-bold">{item.value}</div>
                        </div>
                    ))}
                </div>

                {/* Graph Section */}
                <div className="glass p-8 rounded-3xl border border-white/5 bg-white/5 mb-12">
                    <div className="flex items-center gap-2 mb-8">
                        <BarChart3 className="text-primary" />
                        <h2 className="text-xl font-bold">Accessibility Score Trend</h2>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.scoreTrend}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#ffffff60" />
                                <YAxis stroke="#ffffff60" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#3b82f6' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
