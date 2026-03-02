import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error('登录失败');
            const data = await response.json();

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/admin/dashboard');
        } catch (error) {
            alert('登录失败，请检查账号密码');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
                    <p className="text-gray-500">请使用管理员账号登录后台</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">电子邮箱</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ibc-brand focus:border-transparent transition-all outline-none"
                                placeholder="name@company.com"
                            />
                            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ibc-brand focus:border-transparent transition-all outline-none"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox text-ibc-brand h-4 w-4" />
                            <span className="ml-2 text-sm text-gray-600">记住我</span>
                        </label>
                        <a href="#" className="text-sm font-bold text-ibc-brand hover:underline">忘记密码?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-ibc-brand text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : '登 录'}
                        {!loading && <ArrowRight size={20} className="ml-2" />}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        没有账号? <a href="#" className="text-ibc-brand font-bold hover:underline">联系管理员</a>
                    </p>
                </form>
            </div>
        </div>
    );
};
