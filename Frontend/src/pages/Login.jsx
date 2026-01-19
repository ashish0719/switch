import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Loader2, AlertCircle, LogIn } from 'lucide-react';
import config from '../config';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${config.BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Save to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user)); // Store user object (with socialLinks if backend sends)

            navigate('/');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden selection:bg-yellow-400 selection:text-black">
            <div className="max-w-7xl mx-auto relative">
                {/* Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-yellow-400/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 flex flex-col min-h-screen">
                    <Navbar />

                    <main className="flex-grow px-4 md:px-12 py-12 flex flex-col items-center justify-center">
                        <div className="w-full max-w-md space-y-8 bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl">

                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                                <p className="text-gray-400">Sign in to your account</p>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl animate-fade-in text-sm">
                                    <AlertCircle size={18} className="flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 transition-colors"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 transition-colors"
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-black transition-all duration-300
                    ${loading
                                            ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                            : 'bg-yellow-400 hover:bg-yellow-300 shadow-lg hover:shadow-yellow-400/20'
                                        }`}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                        <>
                                            <LogIn size={20} />
                                            <span>Sign In</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="text-center text-gray-400 text-sm">
                                Don't have an account? <Link to="/register" className="text-yellow-400 hover:underline">Register</Link>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Login;
