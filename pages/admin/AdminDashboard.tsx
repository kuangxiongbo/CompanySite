import React, { useEffect, useState } from 'react';
import { Users, FileText, Package, Download, TrendingUp, Briefcase, Globe, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const API = '/api';
const token = () => localStorage.getItem('token');

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        users: 0, news: 0, pages: 0, downloads: 0, leads: 0, pendingLeads: 0
    });
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const headers = { Authorization: `Bearer ${token()}` };
            const [newsRes, pagesRes, logsRes, leadsRes] = await Promise.all([
                fetch(`${API}/news?limit=1`, { headers }),
                fetch(`${API}/pages`),
                fetch(`${API}/logs?limit=5`, { headers }),
                fetch(`${API}/leads`, { headers }),
            ]);
            const newsData = await newsRes.json();
            const pagesData = await pagesRes.json();
            const logsData = await logsRes.json();
            const leadsData = await leadsRes.json();

            setStats({
                users: 1,
                news: newsData.total || 0,
                pages: Array.isArray(pagesData) ? pagesData.length : 0,
                downloads: 0,
                leads: leadsData.total || 0,
                pendingLeads: (Array.isArray(leadsData.leads) ? leadsData.leads.filter((l: any) => l.status === 'pending').length : 0),
            });
            setLogs(logsData.logs || []);
        } catch (e) {
            console.error('Failed to fetch stats', e);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: '页面数量', value: stats.pages, icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50', link: '/admin/pages' },
        { title: '新闻文章', value: stats.news, icon: FileText, color: 'text-green-500', bg: 'bg-green-50', link: '/admin/news' },
        { title: '商机线索', value: stats.leads, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50', link: '/admin/leads', badge: stats.pendingLeads > 0 ? stats.pendingLeads : null },
        { title: '下载资源', value: stats.downloads, icon: Download, color: 'text-orange-500', bg: 'bg-orange-50', link: '/admin/downloads' },
    ];

    const quickActions = [
        { label: '菜单管理', desc: '调整网站导航结构', path: '/admin/menus', icon: '📋' },
        { label: '页面内容', desc: '编辑产品/方案详情', path: '/admin/pages', icon: '📄' },
        { label: '商机跟进', desc: '查看新商机线索', path: '/admin/leads', icon: '💼', badge: stats.pendingLeads },
        { label: '系统配置', desc: '邮件/AI/主题设置', path: '/admin/settings/site', icon: '⚙️' },
    ];

    const actionColors: Record<string, string> = {
        LOGIN: 'text-blue-500',
        CREATE: 'text-green-500',
        UPDATE: 'text-amber-500',
        DELETE: 'text-red-500',
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">概览</h2>
                <p className="text-sm text-gray-500 mt-1">欢迎回来！这是网站的整体运营概况</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <Link
                        key={stat.title}
                        to={stat.link}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all hover:-translate-y-0.5 group"
                    >
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                            <div className="flex items-center gap-2">
                                <h3 className="text-3xl font-bold text-gray-900">{loading ? '—' : stat.value}</h3>
                                {stat.badge && (
                                    <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-medium">
                                        {stat.badge} 待处理
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={22} />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Logs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <Clock size={16} className="text-blue-500" />
                            最近操作记录
                        </h3>
                        <Link to="/admin/settings/logs" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                            查看全部 <ArrowRight size={12} />
                        </Link>
                    </div>
                    {logs.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">暂无操作记录</p>
                    ) : (
                        <ul className="space-y-3">
                            {logs.map((log: any) => (
                                <li key={log.id} className="flex items-start gap-3">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 ${actionColors[log.action] || 'text-gray-500'} flex-shrink-0 mt-0.5`}>
                                        {log.action}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-700 truncate">{log.detail || log.resource}</p>
                                        <p className="text-xs text-gray-400">{log.username} · {new Date(log.createdAt).toLocaleString('zh-CN')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-base font-bold text-gray-800 mb-4">快速入口</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action) => (
                            <Link
                                key={action.path}
                                to={action.path}
                                className="relative p-4 bg-gray-50 rounded-xl text-left hover:bg-blue-50 hover:border-blue-100 transition-all border border-transparent group"
                            >
                                {action.badge > 0 && (
                                    <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                        {action.badge}
                                    </span>
                                )}
                                <span className="text-2xl mb-2 block">{action.icon}</span>
                                <span className="font-semibold text-gray-800 text-sm block mb-0.5 group-hover:text-blue-700">{action.label}</span>
                                <span className="text-xs text-gray-500">{action.desc}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
