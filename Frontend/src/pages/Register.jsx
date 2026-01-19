import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Loader2, AlertCircle, UserPlus } from 'lucide-react';
import config from '../config';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
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

        // Prep data for backend
        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        };

        try {
            const response = await fetch(`${config.BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Save to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

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
                        <div className="w-full max-w-2xl space-y-8 bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl">

                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold text-white">Create Account</h1>
                                <p className="text-gray-400">Join to save your profile links forever</p>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl animate-fade-in text-sm">
                                    <AlertCircle size={18} className="flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 transition-colors"
                                            placeholder="john@example.com"
                                        />
                                    </div>
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
                                        placeholder="••••••••"
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
                                            <UserPlus size={20} />
                                            <span>Create Account</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="text-center text-gray-400 text-sm">
                                Already have an account? <Link to="/login" className="text-yellow-400 hover:underline">Login</Link>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Register;
