import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FileText, Download, Trash2, Upload, Loader2, AlertCircle } from 'lucide-react';
import config from '../config';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [title, setTitle] = useState('');

    const [file, setFile] = useState(null);
    const [selectedPdf, setSelectedPdf] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'admin') setIsAdmin(true);
        }
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${config.BACKEND_URL}/api/notes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setNotes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${config.BACKEND_URL}/api/notes`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Upload failed');

            setNotes([data.note, ...notes]);
            setTitle('');
            setFile(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${config.BACKEND_URL}/api/notes/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setNotes(notes.filter(n => n._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-yellow-400 selection:text-black">
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                <main className="flex-grow px-4 md:px-12 py-12">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">Study Notes & Resources</h1>
                                <p className="text-gray-400">Access curated materials to help you prepare.</p>
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Upload size={20} className="text-yellow-400" /> Upload Material</h2>
                                {error && <div className="text-red-400 text-sm mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
                                <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
                                    <div className="w-full md:w-1/3 space-y-2">
                                        <label className="text-sm text-gray-400">Title</label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. DSA Cheat Sheet"
                                            className="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-yellow-400 outline-none"
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 space-y-2">
                                        <label className="text-sm text-gray-400">File</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-yellow-400 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-300"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={uploading || !file}
                                        className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                                        Upload
                                    </button>
                                </form>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-yellow-400" size={40} /></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {notes.map((note) => (
                                    <div key={note._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-yellow-400/30 transition-all group relative">
                                        {isAdmin && (
                                            <button onClick={() => handleDelete(note._id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-3 bg-yellow-400/10 rounded-xl">
                                                <FileText size={24} className="text-yellow-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg line-clamp-1" title={note.title}>{note.title}</h3>
                                                <p className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mt-2">
                                            <button
                                                onClick={() => setSelectedPdf(note.fileUrl)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors border border-white/5 hover:border-white/20"
                                            >
                                                <div className="w-5 h-5 flex items-center justify-center">
                                                    {/* Eye Icon SVG */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                                </div>
                                                View
                                            </button>
                                            <a
                                                href={note.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-sm font-bold transition-colors"
                                            >
                                                <Download size={16} />
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                ))}
                                {notes.length === 0 && (
                                    <div className="col-span-full text-center py-20 text-gray-500">
                                        <p>No notes uploaded yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>

            {/* PDF Viewer Modal */}
            {selectedPdf && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-2xl overflow-hidden flex flex-col">
                        <div className="p-4 bg-gray-100 border-b flex justify-between items-center text-black">
                            <h3 className="font-semibold text-lg">Document Viewer</h3>
                            <button onClick={() => setSelectedPdf(null)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                <span className="text-2xl leading-none">&times;</span>
                            </button>
                        </div>
                        <iframe
                            src={selectedPdf}
                            className="w-full flex-grow bg-gray-50"
                            title="PDF Viewer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes;
