import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Download, Menu as MenuIcon, Settings, LogOut, Briefcase,
    ChevronDown, ChevronRight, Globe, Users, ClipboardList, Book, Palette, Key, Bell, Bot
} from 'lucide-react';

interface NavItem {
    icon: React.ElementType;
    label: string;
    path: string;
    children?: { label: string; path: string }[];
}

export const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState<string[]>(['/admin/site', '/admin/settings']);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    const toggleGroup = (path: string) => {
        setExpandedGroups(prev =>
            prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
        );
    };

    const navGroups: NavItem[] = [
        { icon: LayoutDashboard, label: '仪表盘', path: '/admin/dashboard' },
        {
            icon: Globe, label: '内容管理', path: '/admin/site',
            children: [
                { label: '菜单管理', path: '/admin/menus' },
                { label: '页面管理', path: '/admin/pages' },
                { label: '新闻管理', path: '/admin/news' },
                { label: '下载管理', path: '/admin/downloads' },
            ]
        },
        { icon: Briefcase, label: '商机管理', path: '/admin/leads' },
        {
            icon: Settings, label: '系统设置', path: '/admin/settings',
            children: [
                { label: '账号管理', path: '/admin/users' },
                { label: '网站设置', path: '/admin/settings/site' },
                { label: '邮件配置', path: '/admin/settings/email' },
                { label: 'AI 配置', path: '/admin/settings/ai' },
                { label: '主题风格', path: '/admin/settings/theme' },
                { label: '操作日志', path: '/admin/settings/logs' },
            ]
        },
    ];

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <div className={`bg-slate-900 text-white transition-all duration-300 flex-shrink-0 ${isSidebarOpen ? 'w-60' : 'w-16'} flex flex-col z-50`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700 flex-shrink-0">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center">
                                <Key size={14} className="text-white" />
                            </div>
                            <span className="font-bold text-sm text-white">奥联后台管理</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                    >
                        <MenuIcon size={18} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-2">
                    {navGroups.map((item) => (
                        <div key={item.path}>
                            {item.children ? (
                                <div>
                                    <button
                                        onClick={() => toggleGroup(item.path)}
                                        className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-left ${isActive(item.path)
                                                ? 'bg-blue-600 text-white'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        <item.icon size={18} className="flex-shrink-0" />
                                        {isSidebarOpen && (
                                            <>
                                                <span className="ml-3 flex-1 text-sm font-medium">{item.label}</span>
                                                {expandedGroups.includes(item.path)
                                                    ? <ChevronDown size={14} />
                                                    : <ChevronRight size={14} />
                                                }
                                            </>
                                        )}
                                    </button>
                                    {isSidebarOpen && expandedGroups.includes(item.path) && (
                                        <div className="ml-6 mt-1 space-y-0.5 border-l border-slate-700 pl-3">
                                            {item.children.map(child => (
                                                <Link
                                                    key={child.path}
                                                    to={child.path}
                                                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === child.path
                                                            ? 'bg-blue-600 text-white font-medium'
                                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                        }`}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${location.pathname === item.path
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={18} className="flex-shrink-0" />
                                    {isSidebarOpen && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="border-t border-slate-700 p-3 flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                    >
                        <LogOut size={18} className="flex-shrink-0" />
                        {isSidebarOpen && <span className="ml-3 text-sm">退出登录</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 flex-shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <nav className="flex items-center text-sm text-gray-500">
                            <span>后台管理</span>
                            <ChevronRight size={14} className="mx-1" />
                            <span className="text-gray-800 font-medium">
                                {navGroups.flatMap(g => g.children || [g]).find(i => location.pathname.startsWith(i.path))?.label || '概览'}
                            </span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                            <Globe size={13} />
                            查看前台
                        </a>
                        <div className="w-px h-5 bg-gray-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {(JSON.parse(localStorage.getItem('user') || '{}').name || 'A')[0].toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                                {JSON.parse(localStorage.getItem('user') || '{}').name || 'Admin'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto bg-gray-50">
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
