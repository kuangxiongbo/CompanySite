import React, { useEffect, useState } from 'react';
import { Save, Eye, EyeOff, Check, RefreshCw, Globe, Mail, Bot, Palette, Shield, ClipboardList } from 'lucide-react';

interface Config {
    id: number;
    key: string;
    value: string | null;
    category: string;
    label: string;
    type: string;
    isSecret: boolean;
}

interface Log {
    id: number;
    username: string;
    action: string;
    resource: string;
    detail: string;
    ip: string;
    status: string;
    createdAt: string;
}

const API = '/api';
const token = () => localStorage.getItem('token');

const useConfigs = (category: string) => {
    const [configs, setConfigs] = useState<Config[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/settings?category=${category}`, {
                headers: { Authorization: `Bearer ${token()}` }
            });
            setConfigs(await res.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchConfigs(); }, [category]);

    const save = async (updates: Record<string, string>) => {
        await fetch(`${API}/settings/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
            body: JSON.stringify({ configs: updates }),
        });
        await fetchConfigs();
    };

    return { configs, loading, save, refetch: fetchConfigs };
};

// ---- Generic Settings Form ----
const SettingsForm: React.FC<{
    configs: Config[];
    onSave: (data: Record<string, string>) => Promise<void>;
}> = ({ configs, onSave }) => {
    const [values, setValues] = useState<Record<string, string>>({});
    const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
    const [toast, setToast] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const init: Record<string, string> = {};
        configs.forEach(c => { init[c.key] = c.isSecret ? '' : (c.value || ''); });
        setValues(init);
    }, [configs]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = async () => {
        setSaving(true);
        // Only include non-empty secret fields (to avoid overwriting with empty)
        const toSave: Record<string, string> = {};
        for (const c of configs) {
            if (c.isSecret) {
                if (values[c.key]) toSave[c.key] = values[c.key];
            } else {
                toSave[c.key] = values[c.key] || '';
            }
        }
        await onSave(toSave);
        showToast('设置已保存');
        setSaving(false);
    };

    return (
        <div>
            {toast && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
                    <Check size={16} /> {toast}
                </div>
            )}
            <div className="space-y-4">
                {configs.map(c => (
                    <div key={c.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {c.label}
                            {c.isSecret && <span className="ml-2 text-xs text-amber-500 font-normal">（敏感信息）</span>}
                        </label>
                        {c.type === 'textarea' ? (
                            <textarea
                                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                rows={4}
                                value={values[c.key] || ''}
                                onChange={e => setValues(v => ({ ...v, [c.key]: e.target.value }))}
                                placeholder={c.isSecret ? '••••••••（留空不修改）' : c.label}
                            />
                        ) : c.type === 'boolean' ? (
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${values[c.key] === 'true' ? 'bg-blue-500' : 'bg-gray-300'}`}
                                    onClick={() => setValues(v => ({ ...v, [c.key]: v[c.key] === 'true' ? 'false' : 'true' }))}
                                >
                                    <div className={`w-5 h-5 m-0.5 bg-white rounded-full shadow transition-transform ${values[c.key] === 'true' ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                                <span className="text-sm text-gray-600">{values[c.key] === 'true' ? '启用' : '禁用'}</span>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type={c.isSecret && !showSecrets[c.key] ? 'password' : 'text'}
                                    className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                                    value={values[c.key] || ''}
                                    onChange={e => setValues(v => ({ ...v, [c.key]: e.target.value }))}
                                    placeholder={c.isSecret ? '••••••••（留空不修改）' : c.label}
                                />
                                {c.isSecret && (
                                    <button
                                        type="button"
                                        onClick={() => setShowSecrets(s => ({ ...s, [c.key]: !s[c.key] }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showSecrets[c.key] ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <Save size={16} />
                    {saving ? '保存中...' : '保存设置'}
                </button>
            </div>
        </div>
    );
};

// ---- Site Settings ----
export const SiteSettings: React.FC = () => {
    const { configs, loading, save } = useConfigs('general');
    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Globe size={22} /> 网站设置</h2>
                <p className="text-sm text-gray-500 mt-1">配置网站名称、ICP备案号等基本信息</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {loading ? <div className="text-gray-400 text-center py-8">加载中...</div> : <SettingsForm configs={configs} onSave={save} />}
            </div>
        </div>
    );
};

// ---- Email Settings ----
export const EmailSettings: React.FC = () => {
    const { configs, loading, save } = useConfigs('email');
    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Mail size={22} /> 邮件配置</h2>
                <p className="text-sm text-gray-500 mt-1">配置SMTP服务器，用于商机通知邮件发送</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {loading ? <div className="text-gray-400 text-center py-8">加载中...</div> : <SettingsForm configs={configs} onSave={save} />}
            </div>
        </div>
    );
};

// ---- AI Settings ----
export const AiSettings: React.FC = () => {
    const { configs, loading, save } = useConfigs('ai');
    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Bot size={22} /> AI 配置</h2>
                <p className="text-sm text-gray-500 mt-1">配置 AI 服务提供商和 API Key，用于智能客服对话</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {loading ? <div className="text-gray-400 text-center py-8">加载中...</div> : <SettingsForm configs={configs} onSave={save} />}
            </div>
        </div>
    );
};

// ---- Theme Settings ----
const THEMES = [
    { id: 'default', name: '奥联绿', desc: '当前默认主题，清新的安全科技风', colors: ['#044A2B', '#00B140', '#E5F7EC'] },
    { id: 'blue', name: '标准蓝', desc: '专业商务蓝主题', colors: ['#1e3a6e', '#0ea5e9', '#f8fafc'] },
    { id: 'dark', name: '暗黑极简', desc: '时尚暗色主题，突出高科技感', colors: ['#0f172a', '#6366f1', '#1e293b'] },
    { id: 'purple', name: '尊贵紫', desc: '高端紫色主题，彰显品牌实力', colors: ['#4c1d95', '#8b5cf6', '#faf5ff'] },
    { id: 'red', name: '中国红', desc: '热情红色主题，彰显民族特色', colors: ['#7f1d1d', '#ef4444', '#fff5f5'] },
];

export const ThemeSettings: React.FC = () => {
    const { configs, loading, save } = useConfigs('general');
    const [selected, setSelected] = useState('default');
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        const themeConfig = configs.find(c => c.key === 'site_theme');
        if (themeConfig?.value) setSelected(themeConfig.value);
    }, [configs]);

    const handleSave = async () => {
        await save({ site_theme: selected });
        setToast('主题已更新，刷新前台生效');
        setTimeout(() => setToast(null), 4000);
    };

    return (
        <div className="max-w-3xl space-y-6">
            {toast && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
                    <Check size={16} /> {toast}
                </div>
            )}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Palette size={22} /> 主题风格</h2>
                <p className="text-sm text-gray-500 mt-1">选择网站整体视觉风格模板</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {THEMES.map(theme => (
                    <div
                        key={theme.id}
                        onClick={() => setSelected(theme.id)}
                        className={`bg-white rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${selected === theme.id ? 'border-blue-500 shadow-blue-100 shadow-lg' : 'border-gray-100'
                            }`}
                    >
                        {/* Color Preview */}
                        <div className="h-20 rounded-t-xl overflow-hidden flex">
                            {theme.colors.map((color, i) => (
                                <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                            ))}
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-gray-800">{theme.name}</h3>
                                {selected === theme.id && (
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Check size={12} className="text-white" />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">{theme.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                    <Save size={16} />
                    应用主题
                </button>
            </div>
        </div>
    );
};

// ---- Operation Logs ----
export const OperationLogs: React.FC = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/logs?page=${page}&limit=30`, {
                headers: { Authorization: `Bearer ${token()}` }
            });
            const data = await res.json();
            setLogs(data.logs || []);
            setTotal(data.total || 0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, [page]);

    const actionColors: Record<string, string> = {
        LOGIN: 'bg-blue-50 text-blue-600',
        CREATE: 'bg-green-50 text-green-600',
        UPDATE: 'bg-amber-50 text-amber-600',
        DELETE: 'bg-red-50 text-red-600',
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><ClipboardList size={22} /> 操作日志</h2>
                    <p className="text-sm text-gray-500 mt-1">共 {total} 条记录，显示最近操作</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw size={14} /> 刷新
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-3 border-b bg-gray-50 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <div className="col-span-2">时间</div>
                    <div className="col-span-2">操作者</div>
                    <div className="col-span-1">类型</div>
                    <div className="col-span-2">模块</div>
                    <div className="col-span-4">详情</div>
                    <div className="col-span-1">状态</div>
                </div>
                {loading ? (
                    <div className="text-center py-12 text-gray-400">加载中...</div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">暂无日志</div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {logs.map(log => (
                            <div key={log.id} className="px-6 py-3 grid grid-cols-12 gap-4 items-start hover:bg-gray-50/50 transition-colors">
                                <div className="col-span-2 text-xs text-gray-400">
                                    {new Date(log.createdAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="col-span-2 text-sm font-medium text-gray-700">{log.username || '-'}</div>
                                <div className="col-span-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-600'}`}>
                                        {log.action}
                                    </span>
                                </div>
                                <div className="col-span-2 text-xs text-gray-500">{log.resource || '-'}</div>
                                <div className="col-span-4 text-xs text-gray-500 truncate">{log.detail || '-'}</div>
                                <div className="col-span-1">
                                    <span className={`text-xs ${log.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                        {log.status === 'success' ? '成功' : '失败'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {total > 30 && (
                <div className="flex justify-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                    >上一页</button>
                    <span className="px-4 py-2 text-sm text-gray-500">第 {page} 页</span>
                    <button
                        disabled={page * 30 >= total}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                    >下一页</button>
                </div>
            )}
        </div>
    );
};
