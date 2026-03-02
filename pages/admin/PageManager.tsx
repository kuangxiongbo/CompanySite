import React, { useEffect, useState } from 'react';
import {
    Search, Plus, Edit2, Trash2, Eye, ChevronDown, X, Save, Check, BookOpen, Package,
    RefreshCw, UploadCloud, AlertCircle
} from 'lucide-react';

interface Page {
    id: number;
    type: 'product' | 'solution';
    slug: string;
    tag?: string;
    title: { zh: string; en: string };
    subtitle?: { zh: string; en: string };
    description?: { zh: string; en: string };
    heroImage?: string;
    isActive: boolean;
    sortOrder: number;
    categoryId?: number;
    content?: {
        features?: Array<{ title: { zh: string; en: string }; desc: { zh: string; en: string } }>;
        advantages?: Array<{ title: { zh: string; en: string }; desc: { zh: string; en: string } }>;
        useCases?: any[];
        solutionDesc?: string;
        needs?: string;
    };
    categoryInfo?: { id: number; title: { zh: string }; slug: string };
}

interface Category {
    id: number;
    type: string;
    slug: string;
    title: { zh: string; en: string };
}

const API = '/api';
const token = () => localStorage.getItem('token');

const PageEditor: React.FC<{ page: Page; onSave: (data: Page) => void; onClose: () => void; categories: Category[] }> = ({
    page, onSave, onClose, categories
}) => {
    const [form, setForm] = useState<Page>({ ...page });
    const [activeTab, setActiveTab] = useState<'basic' | 'features' | 'advantages' | 'content'>('basic');

    const updateContent = (key: string, value: any) => {
        setForm(f => ({ ...f, content: { ...f.content, [key]: value } }));
    };

    const updateFeature = (index: number, field: string, lang: 'zh' | 'en', value: string) => {
        const features = [...(form.content?.features || [])];
        if (!features[index]) features[index] = { title: { zh: '', en: '' }, desc: { zh: '', en: '' } };
        (features[index] as any)[field][lang] = value;
        updateContent('features', features);
    };

    const updateAdvantage = (index: number, field: string, lang: 'zh' | 'en', value: string) => {
        const advantages = [...(form.content?.advantages || [])];
        if (!advantages[index]) advantages[index] = { title: { zh: '', en: '' }, desc: { zh: '', en: '' } };
        (advantages[index] as any)[field][lang] = value;
        updateContent('advantages', advantages);
    };

    const relevantCategories = categories.filter(c => c.type === form.type);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-4">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">编辑页面内容</h3>
                        <p className="text-sm text-gray-500">{form.title?.zh}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => onSave(form)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Save size={16} />
                            保存
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-6 pt-4 border-b">
                    {[
                        { key: 'basic', label: '基本信息' },
                        { key: 'features', label: '产品特点' },
                        { key: 'advantages', label: '产品优势' },
                        { key: 'content', label: '详情内容' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab.key
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Basic Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">中文标题 *</label>
                                    <input
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={form.title?.zh || ''}
                                        onChange={e => setForm(f => ({ ...f, title: { ...f.title, zh: e.target.value } }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">英文标题</label>
                                    <input
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={form.title?.en || ''}
                                        onChange={e => setForm(f => ({ ...f, title: { ...f.title, en: e.target.value } }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">副标题（中文）</label>
                                <input
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={form.subtitle?.zh || ''}
                                    onChange={e => setForm(f => ({ ...f, subtitle: { ...f.subtitle, zh: e.target.value, en: f.subtitle?.en || '' } }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">摘要描述（中文）</label>
                                <textarea
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    rows={3}
                                    value={form.description?.zh || ''}
                                    onChange={e => setForm(f => ({ ...f, description: { ...f.description, zh: e.target.value, en: f.description?.en || '' } }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                                    <select
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={form.categoryId || ''}
                                        onChange={e => setForm(f => ({ ...f, categoryId: e.target.value ? parseInt(e.target.value) : undefined }))}
                                    >
                                        <option value="">选择分类</option>
                                        {relevantCategories.map(c => (
                                            <option key={c.id} value={c.id}>{c.title?.zh}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                                    <input
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={form.tag || ''}
                                        onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                                        placeholder="如：核心产品"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner图URL</label>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={form.heroImage || ''}
                                        onChange={e => setForm(f => ({ ...f, heroImage: e.target.value }))}
                                        placeholder="https://..."
                                    />
                                    {form.heroImage && (
                                        <img src={form.heroImage} alt="" className="w-12 h-10 object-cover rounded" />
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-gray-700">显示状态</label>
                                <div
                                    className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${form.isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
                                    onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                                >
                                    <div className={`w-5 h-5 m-0.5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                                <span className="text-sm text-gray-600">{form.isActive ? '已上线' : '已下线'}</span>
                            </div>
                        </div>
                    )}

                    {/* Features Tab */}
                    {activeTab === 'features' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">产品特点/功能介绍列表</p>
                                <button
                                    onClick={() => updateContent('features', [...(form.content?.features || []), { title: { zh: '', en: '' }, desc: { zh: '', en: '' } }])}
                                    className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
                                >
                                    <Plus size={14} /> 添加特点
                                </button>
                            </div>
                            {(form.content?.features || []).map((feat, idx) => (
                                <div key={idx} className="border rounded-xl p-4 space-y-3 relative group">
                                    <button
                                        onClick={() => updateContent('features', form.content?.features?.filter((_, i) => i !== idx))}
                                        className="absolute top-3 right-3 p-1 hover:bg-red-100 text-red-500 rounded opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">标题（中文）</label>
                                            <input className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                value={feat.title?.zh || ''}
                                                onChange={e => updateFeature(idx, 'title', 'zh', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">标题（英文）</label>
                                            <input className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                value={feat.title?.en || ''}
                                                onChange={e => updateFeature(idx, 'title', 'en', e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">描述（中文）</label>
                                        <textarea className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2}
                                            value={feat.desc?.zh || ''}
                                            onChange={e => updateFeature(idx, 'desc', 'zh', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Advantages Tab */}
                    {activeTab === 'advantages' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">产品核心优势列表</p>
                                <button
                                    onClick={() => updateContent('advantages', [...(form.content?.advantages || []), { title: { zh: '', en: '' }, desc: { zh: '', en: '' } }])}
                                    className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
                                >
                                    <Plus size={14} /> 添加优势
                                </button>
                            </div>
                            {(form.content?.advantages || []).map((adv, idx) => (
                                <div key={idx} className="border rounded-xl p-4 space-y-3 relative group">
                                    <button
                                        onClick={() => updateContent('advantages', form.content?.advantages?.filter((_, i) => i !== idx))}
                                        className="absolute top-3 right-3 p-1 hover:bg-red-100 text-red-500 rounded opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">标题（中文）</label>
                                            <input className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                value={adv.title?.zh || ''}
                                                onChange={e => updateAdvantage(idx, 'title', 'zh', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">标题（英文）</label>
                                            <input className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                value={adv.title?.en || ''}
                                                onChange={e => updateAdvantage(idx, 'title', 'en', e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">描述（中文）</label>
                                        <textarea className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2}
                                            value={adv.desc?.zh || ''}
                                            onChange={e => updateAdvantage(idx, 'desc', 'zh', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Content Tab */}
                    {activeTab === 'content' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">需求背景（解决方案）</label>
                                <textarea
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    rows={4}
                                    value={form.content?.needs || ''}
                                    onChange={e => updateContent('needs', e.target.value)}
                                    placeholder="描述行业痛点或客户需求..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">解决方案描述</label>
                                <textarea
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    rows={6}
                                    value={form.content?.solutionDesc || ''}
                                    onChange={e => updateContent('solutionDesc', e.target.value)}
                                    placeholder="详细描述解决方案..."
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const PageManager: React.FC = () => {
    const [pages, setPages] = useState<Page[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'product' | 'solution'>('all');
    const [search, setSearch] = useState('');
    const [editPage, setEditPage] = useState<Page | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<string | null>(null);

    useEffect(() => { fetchAll(); fetchSyncStatus(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [pRes, cRes] = await Promise.all([
                fetch(`${API}/pages?all=1`),
                fetch(`${API}/page-categories`),
            ]);
            setPages(await pRes.json());
            setCategories(await cRes.json());
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchSyncStatus = async () => {
        try {
            const res = await fetch(`${API}/sync/status`, {
                headers: { Authorization: `Bearer ${token()}` }
            });
            const data = await res.json();
            const t = data['products.ts']?.lastModified;
            if (t) setLastSync(new Date(t).toLocaleString('zh-CN'));
        } catch { }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await fetch(`${API}/sync/export`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token()}` }
            });
            const data = await res.json();
            if (data.success) {
                showToast(`✓ ${data.message}，前端已自动更新（热更新）`);
                fetchSyncStatus();
            } else {
                showToast(data.message || '同步失败', 'error');
            }
        } catch (e: any) {
            showToast('同步请求失败：' + e.message, 'error');
        } finally {
            setSyncing(false);
        }
    };

    const handleSave = async (data: Page) => {
        try {
            await fetch(`${API}/pages/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify(data)
            });
            showToast('页面已更新，请点击「同步到前端」使改动生效');
            setEditPage(null);
            fetchAll();
        } catch (e) {
            showToast('保存失败', 'error');
        }
    };

    const filteredPages = pages.filter(p => {
        if (filter !== 'all' && p.type !== filter) return false;
        if (search && !(p.title?.zh || '').includes(search)) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`fixed top-4 right-4 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'
                    }`}>
                    {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">页面管理</h2>
                    <p className="text-sm text-gray-500 mt-1">编辑内容后，点击「同步到前端」更新前台显示</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    {lastSync && (
                        <span className="text-xs text-gray-400">上次同步：{lastSync}</span>
                    )}
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm"
                    >
                        {syncing ? <RefreshCw size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                        {syncing ? '同步中...' : '同步到前端'}
                    </button>
                </div>
            </div>

            {/* Page Type Legend */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="text-xs font-semibold text-blue-700 mb-3 uppercase tracking-wide">前端页面类型说明</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { icon: '📋', label: '产品列表页', path: '/products?category=:slug', desc: '按分类展示产品卡片' },
                        { icon: '📦', label: '产品详情页', path: '/products/:slug?name=:名称', desc: '产品介绍/特点/优势' },
                        { icon: '📚', label: '方案列表页', path: '/solutions?category=:slug', desc: '行业方案归类展示' },
                        { icon: '🔍', label: '方案详情页', path: '/solutions/:slug?name=:名称', desc: '方案描述/背景/架构' },
                    ].map(t => (
                        <div key={t.label} className="bg-white rounded-xl p-3 border border-blue-100">
                            <span className="text-lg mb-1 block">{t.icon}</span>
                            <p className="text-xs font-semibold text-gray-700">{t.label}</p>
                            <p className="text-[10px] font-mono text-blue-500 my-1 truncate">{t.path}</p>
                            <p className="text-[10px] text-gray-400">{t.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                    {(['all', 'product', 'solution'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {f === 'all' ? '全部' : f === 'product' ? '产品页' : '方案页'}
                        </button>
                    ))}
                </div>
                <div className="flex-1 relative max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        placeholder="搜索页面..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Page List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-3 border-b bg-gray-50 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <div className="col-span-4">页面名称</div>
                    <div className="col-span-2">类型/分类</div>
                    <div className="col-span-2">特点数</div>
                    <div className="col-span-2">状态</div>
                    <div className="col-span-2 text-right">操作</div>
                </div>
                {loading ? (
                    <div className="text-center py-12 text-gray-400">加载中...</div>
                ) : filteredPages.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">无结果</div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filteredPages.map(page => (
                            <div key={page.id} className="px-6 py-3 grid grid-cols-12 gap-4 items-center hover:bg-gray-50/50 transition-colors">
                                <div className="col-span-4">
                                    <div className="flex items-center gap-2">
                                        {page.type === 'product' ? (
                                            <Package size={16} className="text-blue-400 flex-shrink-0" />
                                        ) : (
                                            <BookOpen size={16} className="text-green-400 flex-shrink-0" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">{page.title?.zh}</p>
                                            <p className="text-xs text-gray-400">{page.slug}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${page.type === 'product'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'bg-green-50 text-green-600'
                                        }`}>
                                        {page.type === 'product' ? '产品' : '方案'}
                                    </span>
                                    {page.categoryInfo && (
                                        <p className="text-xs text-gray-400 mt-0.5">{page.categoryInfo.title?.zh}</p>
                                    )}
                                </div>
                                <div className="col-span-2 text-sm text-gray-500">
                                    {page.content?.features?.length || 0} 个特点
                                </div>
                                <div className="col-span-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${page.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {page.isActive ? '已上线' : '已下线'}
                                    </span>
                                </div>
                                <div className="col-span-2 flex justify-end gap-2">
                                    <a
                                        href={`/#/${page.type === 'product' ? 'products' : 'solutions'}/${page.slug}`}
                                        target="_blank"
                                        rel="noopener"
                                        className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                                    >
                                        <Eye size={15} />
                                    </a>
                                    <button
                                        onClick={() => setEditPage(page)}
                                        className="p-1.5 hover:bg-blue-100 text-blue-500 rounded"
                                    >
                                        <Edit2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Editor Modal */}
            {editPage && (
                <PageEditor
                    page={editPage}
                    categories={categories}
                    onSave={handleSave}
                    onClose={() => setEditPage(null)}
                />
            )}
        </div>
    );
};
