import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, Save, Plus, Trash2, Github, Linkedin, Briefcase, Code, Phone, Award, FolderGit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const [socialLinks, setSocialLinks] = useState({
        github: '', linkedin: '', leetcode: '', portfolio: '', phone: ''
    });

    const [projects, setProjects] = useState([]);
    const [certifications, setCertifications] = useState([]);

    useEffect(() => {
        // Fetch User Data from LocalStorage (or API if we had a /me endpoint)
        // For now, relies on localStorage + manual update
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        try {
            const user = JSON.parse(storedUser);
            if (user.socialLinks) setSocialLinks({ ...socialLinks, ...user.socialLinks });
            if (user.projects) setProjects(user.projects);
            if (user.certifications) setCertifications(user.certifications);
        } catch (e) {
            console.error("Profile load error", e);
        } finally {
            setInitialLoading(false);
        }
    }, [navigate]);

    const handleSocialChange = (e) => {
        setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
    };

    // --- Projects Management ---
    const addProject = () => {
        setProjects([...projects, { title: '', link: '', description: '' }]);
    };
    const updateProject = (index, field, value) => {
        const newProjects = [...projects];
        newProjects[index][field] = value;
        setProjects(newProjects);
    };
    const removeProject = (index) => {
        const newProjects = projects.filter((_, i) => i !== index);
        setProjects(newProjects);
    };

    // --- Certifications Management ---
    const addCert = () => {
        setCertifications([...certifications, { name: '', link: '', issuer: '', date: '' }]);
    };
    const updateCert = (index, field, value) => {
        const newCerts = [...certifications];
        newCerts[index][field] = value;
        setCertifications(newCerts);
    };
    const removeCert = (index) => {
        const newCerts = certifications.filter((_, i) => i !== index);
        setCertifications(newCerts);
    };

    const handleSave = async () => {
        setLoading(true);
        setMsg({ type: '', text: '' });

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            setLoading(false);
            setMsg({ type: 'error', text: 'User session invalid. Please login again.' });
            return;
        }

        try {
            const response = await fetch(`${config.BACKEND_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    socialLinks,
                    projects,
                    certifications
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Update failed');

            // Update LocalStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            setMsg({ type: 'success', text: 'Profile updated successfully!' });

        } catch (err) {
            setMsg({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-yellow-400"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden selection:bg-yellow-400 selection:text-black">
            <div className="max-w-7xl mx-auto relative">
                {/* Background (Reuse) */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-yellow-400/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 flex flex-col min-h-screen">
                    <Navbar />

                    <main className="flex-grow px-4 md:px-12 py-12">
                        <div className="max-w-4xl mx-auto space-y-8">

                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Your Profile</h1>
                                    <p className="text-gray-400">Manage your links and mandatory resume sections.</p>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Save Changes
                                </button>
                            </div>

                            {msg.text && (
                                <div className={`p-4 rounded-xl border ${msg.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                                    {msg.text}
                                </div>
                            )}

                            {/* Social Links */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Briefcase size={20} className="text-yellow-400" /> Social Links</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">GitHub</label>
                                        <div className="flex items-center bg-black/20 border border-gray-700 rounded-lg px-3">
                                            <Github size={16} className="text-gray-500 mr-2" />
                                            <input name="github" value={socialLinks.github} onChange={handleSocialChange} className="w-full bg-transparent py-2 outline-none text-sm" placeholder="URL" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">LinkedIn</label>
                                        <div className="flex items-center bg-black/20 border border-gray-700 rounded-lg px-3">
                                            <Linkedin size={16} className="text-gray-500 mr-2" />
                                            <input name="linkedin" value={socialLinks.linkedin} onChange={handleSocialChange} className="w-full bg-transparent py-2 outline-none text-sm" placeholder="URL" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">LeetCode</label>
                                        <div className="flex items-center bg-black/20 border border-gray-700 rounded-lg px-3">
                                            <Code size={16} className="text-gray-500 mr-2" />
                                            <input name="leetcode" value={socialLinks.leetcode} onChange={handleSocialChange} className="w-full bg-transparent py-2 outline-none text-sm" placeholder="URL" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">Portfolio</label>
                                        <div className="flex items-center bg-black/20 border border-gray-700 rounded-lg px-3">
                                            <Briefcase size={16} className="text-gray-500 mr-2" />
                                            <input name="portfolio" value={socialLinks.portfolio} onChange={handleSocialChange} className="w-full bg-transparent py-2 outline-none text-sm" placeholder="URL" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">Phone</label>
                                        <div className="flex items-center bg-black/20 border border-gray-700 rounded-lg px-3">
                                            <Phone size={16} className="text-gray-500 mr-2" />
                                            <input name="phone" value={socialLinks.phone} onChange={handleSocialChange} className="w-full bg-transparent py-2 outline-none text-sm" placeholder="+91..." />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Projects */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold flex items-center gap-2"><FolderGit2 size={20} className="text-yellow-400" /> Projects</h2>
                                    <button onClick={addProject} className="text-xs flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-green-400"><Plus size={14} /> Add Project</button>
                                </div>
                                <div className="space-y-4">
                                    {projects.map((proj, i) => (
                                        <div key={i} className="bg-black/20 p-4 rounded-xl border border-gray-800 relative group">
                                            <button onClick={() => removeProject(i)} className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                                <input value={proj.title} onChange={(e) => updateProject(i, 'title', e.target.value)} placeholder="Project Title" className="bg-transparent border-b border-gray-700 focus:border-yellow-400 outline-none text-white font-medium" />
                                                <input value={proj.link} onChange={(e) => updateProject(i, 'link', e.target.value)} placeholder="Project Link" className="bg-transparent border-b border-gray-700 focus:border-yellow-400 outline-none text-sm text-blue-400" />
                                            </div>
                                            <textarea value={proj.description} onChange={(e) => updateProject(i, 'description', e.target.value)} placeholder="Short description (Optional - AI will generate if empty)" className="w-full bg-transparent text-sm text-gray-400 outline-none resize-none h-16" />
                                        </div>
                                    ))}
                                    {projects.length === 0 && <p className="text-center text-gray-500 text-sm py-4">No projects added yet.</p>}
                                </div>
                            </div>

                            {/* Certifications */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold flex items-center gap-2"><Award size={20} className="text-yellow-400" /> Certifications</h2>
                                    <button onClick={addCert} className="text-xs flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-green-400"><Plus size={14} /> Add Certification</button>
                                </div>
                                <div className="space-y-4">
                                    {certifications.map((cert, i) => (
                                        <div key={i} className="bg-black/20 p-4 rounded-xl border border-gray-800 relative group">
                                            <button onClick={() => removeCert(i)} className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                                <input value={cert.name} onChange={(e) => updateCert(i, 'name', e.target.value)} placeholder="Certificate Name" className="bg-transparent border-b border-gray-700 focus:border-yellow-400 outline-none text-white font-medium" />
                                                <input value={cert.link} onChange={(e) => updateCert(i, 'link', e.target.value)} placeholder="Certificate Link" className="bg-transparent border-b border-gray-700 focus:border-yellow-400 outline-none text-sm text-blue-400" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <input value={cert.issuer} onChange={(e) => updateCert(i, 'issuer', e.target.value)} placeholder="Issuer (e.g. Udemy)" className="bg-transparent border-b border-gray-700 focus:border-yellow-400 outline-none text-sm text-gray-400" />
                                                <input value={cert.date} onChange={(e) => updateCert(i, 'date', e.target.value)} placeholder="Date (e.g. Jan 2024)" className="bg-transparent border-b border-gray-700 focus:border-yellow-400 outline-none text-sm text-gray-400" />
                                            </div>
                                        </div>
                                    ))}
                                    {certifications.length === 0 && <p className="text-center text-gray-500 text-sm py-4">No certifications added yet.</p>}
                                </div>
                            </div>

                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Profile;
