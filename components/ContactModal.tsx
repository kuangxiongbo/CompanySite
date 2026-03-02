import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    type?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, type = 'consultation' }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/leads/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    type,
                    sourceUrl: window.location.href
                })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
                }, 2000);
            } else {
                const data = await res.json();
                setError(data.message || '提交失败，请稍后重试。');
            }
        } catch (err) {
            setError('网络错误，请稍后重试。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="relative p-6 border-b border-gray-100 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {type === 'customization' ? '咨询定制方案' : '联系销售'}
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        请填写以下信息，我们的专业顾问将尽快与您联系。
                    </p>
                </div>

                <div className="p-6">
                    {success ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">提交成功！</h3>
                            <p className="text-gray-500">感谢您的咨询，我们会尽快与您取得联系。</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ibc-brand focus:border-ibc-brand outline-none transition-shadow"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">联系电话 *</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ibc-brand focus:border-ibc-brand outline-none transition-shadow"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">电子邮箱 *</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ibc-brand focus:border-ibc-brand outline-none transition-shadow"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">公司/机构名称 *</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ibc-brand focus:border-ibc-brand outline-none transition-shadow"
                                    value={formData.company}
                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">咨询内容</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ibc-brand focus:border-ibc-brand outline-none transition-shadow resize-none"
                                    placeholder="请简要描述您的需求..."
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-ibc-brand text-white rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                            >
                                {loading ? '提交中...' : '确认提交'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
