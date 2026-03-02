import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, GripVertical, Link as LinkIcon, Save, X, Check, UploadCloud, RefreshCw } from 'lucide-react';

interface Page {
    id: number;
    slug: string;
    type: string;
    title: { zh: string; en: string };
}

interface MenuItem {
    id: number;
    title: { zh: string; en: string } | string;
    href: string;
    parentId: number | null;
    sortOrder: number;
    isActive: boolean;
    pageId: number | null;
    linkedPage?: Page;
    children?: MenuItem[];
}

const API = '/api';
const token = () => localStorage.getItem('token');

const getTitleText = (title: MenuItem['title']): string => {
    if (typeof title === 'string') return title;
    return title?.zh || title?.en || '';
};

const EditDialog: React.FC<{
    item: Partial<MenuItem>;
    pages: Page[];
    parentItems: MenuItem[];
    onSave: (data: Partial<MenuItem>) => void;
    onClose: () => void;
}> = ({ item, pages, parentItems, onSave, onClose }) => {
    const [form, setForm] = useState({
        titleZh: typeof item.title === 'object' ? item.title.zh : (item.title || ''),
        titleEn: typeof item.title === 'object' ? item.title.en : '',
        href: item.href || '',
        parentId: item.parentId ?? null,
        isActive: item.isActive ?? true,
        pageId: item.pageId ?? null,
        sortOrder: item.sortOrder ?? 0,
    });

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-lg font-bold text-gray-800">{item.id ? '编辑菜单' : '新增菜单'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">中文名称 *</label>
                            <input
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.titleZh}
                                onChange={e => setForm(f => ({ ...f, titleZh: e.target.value }))}
                                placeholder="如：产品中心"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">英文名称</label>
                            <input
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.titleEn}
                                onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))}
                                placeholder="如：Products"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">链接地址</label>
                        <input
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.href}
                            onChange={e => setForm(f => ({ ...f, href: e.target.value }))}
                            placeholder="如：/products"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">关联页面（可选）</label>
                        <select
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.pageId || ''}
                            onChange={e => setForm(f => ({ ...f, pageId: e.target.value ? parseInt(e.target.value) : null }))}
                        >
                            <option value="">不关联页面</option>
                            {pages.map(p => (
                                <option key={p.id} value={p.id}>
                                    [{p.type === 'product' ? '产品' : '方案'}] {p.title?.zh || p.slug}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">上级菜单</label>
                        <select
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.parentId || ''}
                            onChange={e => setForm(f => ({ ...f, parentId: e.target.value ? parseInt(e.target.value) : null }))}
                        >
                            <option value="">顶级菜单</option>
                            {parentItems.filter(p => p.id !== item.id).map(p => (
                                <option key={p.id} value={p.id}>{getTitleText(p.title)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                            <input
                                type="number"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.sortOrder}
                                onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                        <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <div
                                    className={`w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
                                    onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                                >
                                    <div className={`w-5 h-5 m-0.5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                                <span className="text-sm text-gray-700">{form.isActive ? '已启用' : '已禁用'}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 p-6 border-t">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 font-medium hover:bg-gray-50 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={() => onSave({
                            ...item,
                            title: { zh: form.titleZh, en: form.titleEn },
                            href: form.href,
                            parentId: form.parentId,
                            isActive: form.isActive,
                            pageId: form.pageId,
                            sortOrder: form.sortOrder,
                        })}
                        className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition-colors"
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
};

const MenuItemRow: React.FC<{
    item: MenuItem;
    depth: number;
    onEdit: (item: MenuItem) => void;
    onDelete: (id: number) => void;
    onAdd: (parentId: number) => void;
}> = ({ item, depth, onEdit, onDelete, onAdd }) => {
    const [expanded, setExpanded] = useState(depth === 0);
    const hasChildren = item.children && item.children.length > 0;

    return (
        <div>
            <div
                className={`flex items-center gap-2 py-2.5 px-3 rounded-lg hover:bg-gray-50 group transition-colors ${!item.isActive ? 'opacity-50' : ''}`}
                style={{ paddingLeft: `${depth * 24 + 12}px` }}
            >
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {hasChildren ? (
                        <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        </button>
                    ) : (
                        <span className="w-[19px] flex-shrink-0" />
                    )}
                    <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
                    <span className="font-medium text-gray-800 text-sm truncate">{getTitleText(item.title)}</span>
                    {item.href && (
                        <span className="text-xs text-gray-400 font-mono truncate">→ {item.href}</span>
                    )}
                    {item.linkedPage && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded flex-shrink-0">
                            {item.linkedPage.title?.zh}
                        </span>
                    )}
                    {!item.isActive && (
                        <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded flex-shrink-0">已禁用</span>
                    )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                        onClick={() => onAdd(item.id)}
                        className="p-1.5 hover:bg-green-100 text-green-600 rounded"
                        title="添加子菜单"
                    >
                        <Plus size={14} />
                    </button>
                    <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 hover:bg-blue-100 text-blue-600 rounded"
                        title="编辑"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 hover:bg-red-100 text-red-600 rounded"
                        title="删除"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            {expanded && hasChildren && (
                <div>
                    {item.children!.map(child => (
                        <MenuItemRow
                            key={child.id}
                            item={child}
                            depth={depth + 1}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAdd={onAdd}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const MenuManager: React.FC = () => {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [editItem, setEditItem] = useState<Partial<MenuItem> | null>(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        fetchMenus();
        fetchPages();
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await fetch(`${API}/sync/export`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token()}` }
            });
            const data = await res.json();
            showToast(data.success ? `✓ 同步成功！${data.message}` : `同步失败：${data.message}`);
        } catch (e: any) {
            showToast('同步失败：' + e.message);
        } finally {
            setSyncing(false);
        }
    };

    const fetchMenus = async () => {
        try {
            const res = await fetch(`${API}/menus/all`, {
                headers: { 'Authorization': `Bearer ${token()}` }
            });
            const data = await res.json();
            setMenus(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchPages = async () => {
        try {
            const res = await fetch(`${API}/pages`, {
                headers: { 'Authorization': `Bearer ${token()}` }
            });
            const data = await res.json();
            setPages(Array.isArray(data) ? data : []);
        } catch (e) { }
    };

    // Flatten menus for parent selection
    const flattenMenus = (items: MenuItem[]): MenuItem[] => {
        return items.flatMap(item => [item, ...(item.children ? flattenMenus(item.children) : [])]);
    };

    const handleSave = async (data: Partial<MenuItem>) => {
        setSaving(true);
        try {
            if (data.id) {
                await fetch(`${API}/menus/${data.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                    body: JSON.stringify(data)
                });
                showToast('菜单已更新');
            } else {
                await fetch(`${API}/menus`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                    body: JSON.stringify(data)
                });
                showToast('菜单已新增');
            }
            setEditItem(null);
            fetchMenus();
        } catch (e) {
            showToast('保存失败');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('确定删除该菜单项？其子菜单也会被删除。')) return;
        await fetch(`${API}/menus/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token()}` }
        });
        showToast('已删除');
        fetchMenus();
    };

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce-in">
                    <Check size={16} />
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">菜单管理</h2>
                    <p className="text-sm text-gray-500 mt-1">管理网站导航菜单的结构、名称和链接</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="flex items-center gap-2 border border-emerald-300 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                        {syncing ? <RefreshCw size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                        {syncing ? '同步中...' : '同步到前端'}
                    </button>
                    <button
                        onClick={() => setEditItem({ parentId: null, isActive: true, sortOrder: 0 })}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={18} />
                        新增顶级菜单
                    </button>
                </div>
            </div>

            {/* Menu Tree */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <LinkIcon size={16} />
                        菜单树结构
                    </h3>
                    <span className="text-xs text-gray-400">共 {flattenMenus(menus).length} 个菜单项</span>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">加载中...</p>
                    </div>
                ) : menus.length === 0 ? (
                    <div className="text-center py-16">
                        <LinkIcon size={40} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">暂无菜单数据</p>
                        <button
                            onClick={() => setEditItem({ parentId: null, isActive: true, sortOrder: 0 })}
                            className="mt-4 text-blue-500 hover:underline text-sm"
                        >
                            创建第一个菜单
                        </button>
                    </div>
                ) : (
                    <div className="p-3">
                        {menus.map(item => (
                            <MenuItemRow
                                key={item.id}
                                item={item}
                                depth={0}
                                onEdit={setEditItem}
                                onDelete={handleDelete}
                                onAdd={(parentId) => setEditItem({ parentId, isActive: true, sortOrder: 0 })}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            {editItem && (
                <EditDialog
                    item={editItem}
                    pages={pages}
                    parentItems={flattenMenus(menus)}
                    onSave={handleSave}
                    onClose={() => setEditItem(null)}
                />
            )}
        </div>
    );
};
