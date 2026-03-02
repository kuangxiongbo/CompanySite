import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, X, Save, Check, RefreshCw } from 'lucide-react';

interface News {
    id: number;
    title: { zh: string; en: string };
    slug: string;
    category: string;
    publishedAt: string;
    summary?: { zh: string; en: string };
    content?: { zh: string; en: string };
    coverImage?: string;
    views: number;
    isPublished: boolean;
}

const API = '/api';
const token = () => localStorage.getItem('token');

export const NewsManager: React.FC = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editItem, setEditItem] = useState<Partial<News> | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const [syncing, setSyncing] = useState(false);

    useEffect(() => { fetchNews(); }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/news/all`, {
                headers: { 'Authorization': `Bearer ${token()}` }
            });
            const data = await res.json();
            setNewsList(data);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!confirm('确定同步新闻数据到前端静态文件？')) return;
        setSyncing(true);
        try {
            const res = await fetch(`${API}/sync/export-news`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token()}` }
            });
            if (res.ok) {
                showToast('同步成功，前端数据已更新');
            } else {
                showToast('同步失败');
            }
        } catch (e) {
            showToast('同步请求失败');
        } finally {
            setSyncing(false);
        }
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = async () => {
        try {
            const method = editItem?.id ? 'PUT' : 'POST';
            const url = editItem?.id ? `${API}/news/${editItem.id}` : `${API}/news`;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify(editItem)
            });

            if (res.ok) {
                showToast('保存成功');
                setEditItem(null);
                fetchNews();
            } else {
                showToast('保存失败');
            }
        } catch (e) {
            showToast('请求失败');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('确定删除该新闻？')) return;
        await fetch(`${API}/news/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token()}` }
        });
        showToast('已删除');
        fetchNews();
    };

    const filtered = newsList.filter(n => (n.title?.zh || '').includes(search));

    return (
        <div className="space-y-6">
            {toast && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
                    <Check size={16} /> {toast}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">新闻管理</h2>
                    <p className="text-sm text-gray-500 mt-1">管理公司动态、行业分析与政策解读</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {syncing ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                        同步到前端
                    </button>
                    <button
                        onClick={() => setEditItem({ isPublished: true, category: '公司动态', title: { zh: '', en: '' }, content: { zh: '', en: '' } })}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={18} /> 发布新闻
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-100">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索新闻标题..."
                            className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 border-b">
                            <th className="px-6 py-3 font-medium">标题</th>
                            <th className="px-6 py-3 font-medium">分类</th>
                            <th className="px-6 py-3 font-medium">发布时间</th>
                            <th className="px-6 py-3 font-medium">浏览量</th>
                            <th className="px-6 py-3 font-medium">状态</th>
                            <th className="px-6 py-3 font-medium text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-800">{item.title?.zh}</td>
                                <td className="px-6 py-4 text-gray-500">{item.category}</td>
                                <td className="px-6 py-4 text-gray-500">{new Date(item.publishedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-gray-500">{item.views}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${item.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {item.isPublished ? '已发布' : '草稿'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => setEditItem(item)} className="text-blue-500 hover:underline">编辑</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">删除</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editItem && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h3 className="font-bold text-lg">{editItem.id ? '编辑新闻' : '发布新闻'}</h3>
                            <button onClick={() => setEditItem(null)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium mb-1">中文标题 *</label>
                                <input
                                    className="w-full border p-2 rounded-lg outline-none"
                                    value={editItem.title?.zh || ''}
                                    onChange={e => setEditItem({ ...editItem, title: { ...editItem.title, zh: e.target.value, en: editItem.title?.en || '' } })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">分类</label>
                                    <select
                                        className="w-full border p-2 rounded-lg outline-none"
                                        value={editItem.category || '公司动态'}
                                        onChange={e => setEditItem({ ...editItem, category: e.target.value })}
                                    >
                                        <option value="公司动态">公司动态</option>
                                        <option value="行业动态">行业动态</option>
                                        <option value="政策解读">政策解读</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">封面图 URL</label>
                                    <input
                                        className="w-full border p-2 rounded-lg outline-none"
                                        value={editItem.coverImage || ''}
                                        onChange={e => setEditItem({ ...editItem, coverImage: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">中文摘要</label>
                                <textarea
                                    className="w-full border p-2 rounded-lg outline-none resize-none" rows={2}
                                    value={editItem.summary?.zh || ''}
                                    onChange={e => setEditItem({ ...editItem, summary: { ...editItem.summary, zh: e.target.value, en: editItem.summary?.en || '' } })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">中文正文内容 (支持 HTML)</label>
                                <textarea
                                    className="w-full border p-2 rounded-lg outline-none resize-none" rows={8}
                                    value={editItem.content?.zh || ''}
                                    onChange={e => setEditItem({ ...editItem, content: { ...editItem.content, zh: e.target.value, en: editItem.content?.en || '' } })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="isPublished" checked={editItem.isPublished} onChange={e => setEditItem({ ...editItem, isPublished: e.target.checked })} />
                                <label htmlFor="isPublished" className="text-sm">立即发布</label>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setEditItem(null)} className="px-4 py-2 border rounded-xl bg-white hover:bg-gray-50 text-sm">取消</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium flex items-center gap-2"><Save size={16} />保存</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
