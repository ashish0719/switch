import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Type, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const OptimizeResume = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [jdFile, setJdFile] = useState(null);
    const [jdText, setJdText] = useState('');
    const [jdMode, setJdMode] = useState('text'); // 'file' or 'text'
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const navigate = useNavigate();

    // AUTH GUARD: Redirect if not logged in
    React.useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'resume') setResumeFile(file);
            else setJdFile(file);
            setError(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (type === 'resume') setResumeFile(file);
            else setJdFile(file);
            setError(null);
        }
    };

    const fetchPdfPreview = async (optimizedData) => {
        try {
            setPreviewLoading(true);
            const response = await fetch(`${config.BACKEND_URL}/api/resumes/preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeData: optimizedData,
                    templateId: 'templateA'
                }),
            });

            if (!response.ok) throw new Error('Failed to generate PDF preview');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setPdfUrl(url);
        } catch (err) {
            console.error("Preview Error:", err);
            setError("Optimization successful, but PDF preview failed to load.");
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!resumeFile) {
            setError('Please upload your Resume.');
            return;
        }
        if (jdMode === 'file' && !jdFile) {
            setError('Please upload the Job Description file.');
            return;
        }
        if (jdMode === 'text' && !jdText.trim()) {
            setError('Please enter the Job Description text.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setPdfUrl(null);

        const formData = new FormData();
        formData.append('resumeFile', resumeFile);

        if (jdMode === 'file') {
            formData.append('jdFile', jdFile);
        } else {
            formData.append('jd', jdText);
        }

        // [FEATURE] Attach User ID for Profile Links
        let user = null;
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) user = JSON.parse(storedUser);
        } catch (e) {
            console.error("Error parsing user", e);
        }

        if (user && user.id) {
            formData.append('userId', user.id);
        }

        try {
            const response = await fetch(`${config.BACKEND_URL}/api/resumes/optimize`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Optimization failed. Please try again.');
            }

            const data = await response.json();
            setResult(data);

            if (data.success && data.optimizedResume) {
                await fetchPdfPreview(data.optimizedResume);
            }

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

                    <main className="flex-grow px-4 md:px-12 py-12 flex flex-col items-center">
                        <div className="w-full max-w-4xl space-y-8">

                            <div className="text-center space-y-4">
                                <h1 className="text-4xl md:text-5xl font-semibold text-white">
                                    Optimize Your <span className="text-yellow-400">Resume</span>
                                </h1>
                                <p className="text-gray-400 text-lg">
                                    Upload your resume and provide the job description to get an AI-tailored resume.
                                </p>
                            </div>

                            {/* Input Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                                {/* Resume Upload */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1 h-8">
                                        <label className="text-sm font-medium text-gray-300">Your Resume (PDF/DOCX)</label>
                                    </div>
                                    <div
                                        className={`h-64 border border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300
                        ${resumeFile ? 'border-green-500/50 bg-green-500/10' : 'border-gray-700 hover:border-yellow-400/50 bg-white/5'}`}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, 'resume')}
                                    >
                                        <input
                                            type="file"
                                            id="resume-upload"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => handleFileChange(e, 'resume')}
                                        />
                                        <label htmlFor="resume-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                            {resumeFile ? (
                                                <>
                                                    <CheckCircle className="w-10 h-10 text-green-400 mb-3" />
                                                    <p className="text-sm text-green-300 font-medium truncate max-w-[200px]">{resumeFile.name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Ready to upload</p>
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="w-10 h-10 text-gray-400 mb-3" />
                                                    <p className="text-white font-medium mb-1">Upload Resume</p>
                                                    <p className="text-xs text-gray-500">Drag & drop or browse</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* JD Input (Toggle between File/Text) */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-sm font-medium text-gray-300">Job Description</label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => navigate('/profile')}
                                                className="bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-lg hover:shadow-yellow-400/20 mr-2"
                                            >
                                                Add Project Links
                                            </button>
                                            <div className="flex bg-white/10 rounded-lg p-1">
                                                <button
                                                    onClick={() => setJdMode('text')}
                                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${jdMode === 'text' ? 'bg-yellow-400 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                                >
                                                    Text
                                                </button>
                                                <button
                                                    onClick={() => setJdMode('file')}
                                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${jdMode === 'file' ? 'bg-yellow-400 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                                >
                                                    File
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {jdMode === 'file' ? (
                                        <div
                                            className={`h-64 border border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300
                            ${jdFile ? 'border-green-500/50 bg-green-500/10' : 'border-gray-700 hover:border-yellow-400/50 bg-white/5'}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, 'jd')}
                                        >
                                            <input
                                                type="file"
                                                id="jd-upload"
                                                className="hidden"
                                                accept=".pdf,.doc,.txt"
                                                onChange={(e) => handleFileChange(e, 'jd')}
                                            />
                                            <label htmlFor="jd-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                                {jdFile ? (
                                                    <>
                                                        <CheckCircle className="w-10 h-10 text-green-400 mb-3" />
                                                        <p className="text-sm text-green-300 font-medium truncate max-w-[200px]">{jdFile.name}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Ready to upload</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                                        <p className="text-white font-medium mb-1">Upload JD File</p>
                                                        <p className="text-xs text-gray-500">Drag & drop or browse</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    ) : (
                                        <textarea
                                            value={jdText}
                                            onChange={(e) => setJdText(e.target.value)}
                                            placeholder="Paste the job description here..."
                                            className="w-full h-64 bg-white/5 border border-gray-700 rounded-2xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 resize-none selection:text-white selection:bg-yellow-400/30 font-mono leading-relaxed"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Helper Link for Profile */}
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-2">
                                    Want to include your latest project links?
                                </p>
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="text-yellow-400 hover:text-yellow-300 text-sm font-medium underline underline-offset-4 transition-colors"
                                >
                                    Update Profile Links First
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center justify-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl max-w-2xl mx-auto animate-fade-in">
                                    <AlertCircle size={24} className="flex-shrink-0" />
                                    <span className="text-base font-medium">{error}</span>
                                </div>
                            )}

                            {/* Action Button */}
                            <div className="flex justify-center pt-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !resumeFile || (jdMode === 'file' ? !jdFile : !jdText)}
                                    className={`flex items-center gap-2 px-10 py-4 rounded-full font-bold text-black transition-all duration-300
                    ${loading
                                            ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                            : 'bg-yellow-400 hover:bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] transform hover:-translate-y-1'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Optimizing Resume...</span>
                                        </>
                                    ) : (
                                        <span>Generate Optimized Resume</span>
                                    )}
                                </button>
                            </div>

                            {/* PDF Live Preview Result */}
                            {(pdfUrl || previewLoading) && (
                                <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-1 backdrop-blur-xl animate-fade-in overflow-hidden relative">
                                    <div className="bg-black/40 p-4 border-b border-white/5 flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                            <Eye size={20} className="text-yellow-400" />
                                            Live Preview
                                        </h2>
                                        {pdfUrl && (
                                            <a
                                                href={pdfUrl}
                                                download="optimized_resume.pdf"
                                                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-green-900/20"
                                            >
                                                <Download size={16} />
                                                Download PDF
                                            </a>
                                        )}
                                    </div>

                                    <div className="w-full h-[800px] bg-gray-900 flex justify-center items-center relative">
                                        {previewLoading ? (
                                            <div className="text-center">
                                                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin mx-auto mb-4" />
                                                <p className="text-gray-400">Generating PDF Preview...</p>
                                            </div>
                                        ) : (
                                            <iframe
                                                src={pdfUrl}
                                                className="w-full h-full border-none"
                                                title="Resume Preview"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default OptimizeResume;
