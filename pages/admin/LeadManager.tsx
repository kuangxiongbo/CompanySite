import React, { useState, useEffect } from 'react';
import { Eye, Search, Mail, Filter } from 'lucide-react';

interface Lead {
    id: string;
    type: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
    sourceUrl: string;
    status: string;
    createdAt: string;
}

export const LeadManager: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/leads', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Handle both array and paginated response
                setLeads(Array.isArray(data) ? data : (data.leads || []));
            }
        } catch (error) {
            console.error('Failed to fetch leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        const token = localStorage.getItem('token');
        await fetch(`/api/leads/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        setLeads(leads => leads.map(l => l.id === id ? { ...l, status } : l));
        setSelectedLead(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">商机管理</h2>
                    <p className="text-gray-500 mt-1">查看和管理来自网站各个页面的客户咨询与联系记录。</p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                        <Filter size={18} className="mr-2" />
                        筛选
                    </button>
                    <button className="flex items-center px-4 py-2 bg-ibc-brand text-white rounded-lg hover:bg-green-600 shadow-sm transition-colors">
                        导出报表
                    </button>
                </div>
            </div>

            <div className="flex bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="搜索姓名、公司或联系方式..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ibc-brand/50"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">加载中...</div>
            ) : leads.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
                    暂无商机数据
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="p-4 font-medium text-gray-600">类型/来源</th>
                                <th className="p-4 font-medium text-gray-600">姓名</th>
                                <th className="p-4 font-medium text-gray-600">联系方式</th>
                                <th className="p-4 font-medium text-gray-600">公司/机构</th>
                                <th className="p-4 font-medium text-gray-600">状态</th>
                                <th className="p-4 font-medium text-gray-600">提交时间</th>
                                <th className="p-4 font-medium text-gray-600 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map(lead => (
                                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{lead.type === 'consultation' ? '商务咨询' : lead.type}</div>
                                    </td>
                                    <td className="p-4">{lead.name}</td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            <div>{lead.phone}</div>
                                            <div className="text-gray-500">{lead.email}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">{lead.company}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                            lead.status === 'contacted' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {lead.status === 'new' ? '新入账' : lead.status === 'contacted' ? '已联系' : lead.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {new Date(lead.createdAt).toLocaleString('zh-CN')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedLead(lead)}
                                            className="text-ibc-brand hover:underline flex items-center justify-end w-full"
                                        >
                                            <Eye size={16} className="mr-1" />
                                            查看
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {selectedLead && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl">商机详情</h3>
                            <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-700">关闭</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">姓名</p>
                                    <p className="font-medium">{selectedLead.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">类型</p>
                                    <p className="font-medium">{selectedLead.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">联系电话</p>
                                    <p className="font-medium">{selectedLead.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">邮箱地址</p>
                                    <p className="font-medium">{selectedLead.email}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500 mb-1">公司/机构</p>
                                    <p className="font-medium">{selectedLead.company}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500 mb-1">来源页面</p>
                                    <a href={selectedLead.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
                                        {selectedLead.sourceUrl}
                                    </a>
                                </div>
                                <div className="col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <p className="text-sm text-gray-500 mb-2">咨询内容/留言</p>
                                    <p className="whitespace-pre-wrap">{selectedLead.message}</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                                <a
                                    href={`mailto:${selectedLead.email}`}
                                    className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Mail size={18} className="mr-2" />
                                    发送邮件
                                </a>
                                <button
                                    onClick={() => updateStatus(selectedLead.id, 'contacted')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                    ✓ 标记已联系
                                </button>
                                <button
                                    onClick={() => updateStatus(selectedLead.id, 'closed')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                >
                                    关闭
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
