import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Save, Check } from 'lucide-react';

interface Download {
    id: number;
    name: { zh: string; en: string };
    type: string;
    size: string;
    url: string;
    category: string;
    isPublic: boolean;
    createdAt: string;
}

const API = '/api';
const token = () => localStorage.getItem('token');

export const DownloadManager: React.FC = () => {
    const [list, setList] = useState<Download[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editItem, setEditItem] = useState<Partial<Download> | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => { fetchList(); }, []);

    const fetchList = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/downloads`);
            const data = await res.json();
            setList(data);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = async () => {
        try {
            const method = editItem?.id ? 'PUT' : 'POST';
            const url = editItem?.id ? `${API}/downloads/${editItem.id}` : `${API}/downloads`;

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify(editItem)
            });
            showToast('保存成功');
            setEditItem(null);
            fetchList();
        } catch (e) {
            showToast('保存失败');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('确定删除该资源？')) return;
        await fetch(`${API}/downloads/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token()}` }
        });
        showToast('已删除');
        fetchList();
    };

    const filtered = list.filter(n => (n.name?.zh || '').includes(search));

    return (
        <div className="space-y-6">
            {toast && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
                    <Check size={16} /> {toast}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">下载管理</h2>
                    <p className="text-sm text-gray-500 mt-1">管理客户可下载的技术白皮书、产品手册等资源</p>
                </div>
                <button
                    onClick={() => setEditItem({ isPublic: true, name: { zh: '', en: '' } })}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                    <Plus size={18} /> 新增资源
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-100">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索资源名称..."
                            className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 border-b">
                            <th className="px-6 py-3 font-medium">资源名称</th>
                            <th className="px-6 py-3 font-medium">格式</th>
                            <th className="px-6 py-3 font-medium">大小</th>
                            <th className="px-6 py-3 font-medium">分类</th>
                            <th className="px-6 py-3 font-medium">状态</th>
                            <th className="px-6 py-3 font-medium text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-800">{item.name?.zh}</td>
                                <td className="px-6 py-4 text-gray-500">{item.type}</td>
                                <td className="px-6 py-4 text-gray-500">{item.size}</td>
                                <td className="px-6 py-4 text-gray-500">{item.category}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${item.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {item.isPublic ? '公开' : '私有'}
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
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h3 className="font-bold text-lg">{editItem.id ? '编辑资源' : '新增资源'}</h3>
                            <button onClick={() => setEditItem(null)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium mb-1">中文名称 *</label>
                                <input
                                    className="w-full border p-2 rounded-lg outline-none"
                                    value={editItem.name?.zh || ''}
                                    onChange={e => setEditItem({ ...editItem, name: { ...editItem.name, zh: e.target.value, en: editItem.name?.en || '' } })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">文件格式 (如 PDF)</label>
                                    <input
                                        className="w-full border p-2 rounded-lg outline-none"
                                        value={editItem.type || 'PDF'}
                                        onChange={e => setEditItem({ ...editItem, type: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">文件大小 (如 2.5MB)</label>
                                    <input
                                        className="w-full border p-2 rounded-lg outline-none"
                                        value={editItem.size || ''}
                                        onChange={e => setEditItem({ ...editItem, size: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">分类</label>
                                    <select
                                        className="w-full border p-2 rounded-lg outline-none"
                                        value={editItem.category || 'general'}
                                        onChange={e => setEditItem({ ...editItem, category: e.target.value })}
                                    >
                                        <option value="whitepaper">技术白皮书</option>
                                        <option value="manual">产品手册</option>
                                        <option value="sdk">开发SDK</option>
                                        <option value="general">其他资料</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">资源下载链接 URL *</label>
                                    <input
                                        className="w-full border p-2 rounded-lg outline-none"
                                        value={editItem.url || ''}
                                        onChange={e => setEditItem({ ...editItem, url: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <input type="checkbox" id="isPublic" checked={editItem.isPublic} onChange={e => setEditItem({ ...editItem, isPublic: e.target.checked })} />
                                <label htmlFor="isPublic" className="text-sm">对公众开放下载</label>
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
