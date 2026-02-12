import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('admin@demo.com');
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // DEMO LOGIC: Simulate API call
        setTimeout(() => {
            // In real app: const data = await api.post('/login', { ... })
            const token = "mock.jwt.token";
            let role: 'Admin' | 'Editor' | 'Viewer' | 'Owner' = 'Viewer';
            if (email.includes('admin')) role = 'Admin';
            else if (email.includes('editor')) role = 'Editor';
            else if (email.includes('viewer')) role = 'Viewer';
            else if (email.includes('owner')) role = 'Owner';

            login(token, role);
            setLoading(false);
        }, 800);
    };

    const fillCredential = (role: string) => {
        if (role === 'Owner') setEmail('owner@demo.com');
        else if (role === 'Admin') setEmail('admin@demo.com');
        else if (role === 'Editor') setEmail('editor@demo.com');
        else if (role === 'Viewer') setEmail('viewer@example.com');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
                {/* Header Section */}
                <div className="pt-10 pb-8 px-8 bg-white text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 text-white shadow-lg mb-6 transform transition-transform hover:scale-105 duration-300">
                        <span className="font-bold text-2xl font-mono">A</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 mt-2 text-sm font-medium">AI Project Management Platform</p>
                </div>

                {/* Login Form */}
                <div className="px-8 pb-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Demo Credentials Footer */}
                <div className="bg-slate-50 p-6 border-t border-slate-100">
                    <div className="text-center mb-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Demo Access</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {['Admin', 'Editor', 'Viewer'].map((role) => (
                            <button
                                key={role}
                                onClick={() => fillCredential(role)}
                                className="px-2 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all text-center"
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => fillCredential('Owner')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-100 rounded-md hover:bg-purple-100 transition-colors"
                    >
                        <ShieldCheck size={14} />
                        Owner Access (Full Control)
                    </button>
                </div>
            </div>

            {/* Footer Attribution - Optional */}
            <div className="absolute bottom-6 text-slate-400 text-xs font-medium">
                &copy; {new Date().getFullYear()} AI Project Manager. All rights reserved.
            </div>
        </div>
    );
};
