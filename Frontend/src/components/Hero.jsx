
import React from 'react';

const Hero = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 px-4 md:px-12 relative">
            <div className="space-y-6 z-10">
                <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight">
                    Switch to <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Your Dream</span> <br />
                    <span className="text-white">Career</span>
                </h1>
                <p className="text-gray-400 max-w-lg text-lg leading-relaxed">
                    The all-in-one platform to optimize your resume, master technical skills, and land your next job.
                </p>

                <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-transparent rounded-full mt-8" />
            </div>

            <div className="relative flex justify-center items-center">
                {/* Abstract Tech Visualization */}
                <div className="relative w-full max-w-md aspect-square">
                    {/* Glowing nodes illustration simulation */}
                    <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                        <defs>
                            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#eab308" stopOpacity="0.8" />
                            </linearGradient>
                        </defs>

                        {/* Connecting lines */}
                        <path d="M50 200 L150 100 L250 150 L350 50" stroke="url(#lineGrad)" strokeWidth="2" fill="none" />
                        <path d="M150 100 L200 250 L300 200" stroke="url(#lineGrad)" strokeWidth="2" fill="none" />
                        <path d="M50 200 L100 280 L250 150" stroke="url(#lineGrad)" strokeWidth="2" fill="none" />

                        {/* Nodes with continuous random "breathing" */}
                        <circle cx="50" cy="200" r="6" className="animate-breathing-glow" style={{ animationDelay: '0s' }} />
                        <circle cx="150" cy="100" r="6" className="animate-breathing-glow" style={{ animationDelay: '1.2s' }} />
                        <circle cx="250" cy="150" r="6" className="animate-breathing-glow" style={{ animationDelay: '0.4s' }} />
                        <circle cx="350" cy="50" r="6" className="animate-breathing-glow" style={{ animationDelay: '1.8s' }} />
                        <circle cx="200" cy="250" r="6" className="animate-breathing-glow" style={{ animationDelay: '0.8s' }} />
                        <circle cx="100" cy="280" r="6" className="animate-breathing-glow" style={{ animationDelay: '1.5s' }} />
                        <circle cx="300" cy="200" r="6" className="animate-breathing-glow" style={{ animationDelay: '0.2s' }} />
                    </svg>
                    <div className="absolute bottom-0 right-0 text-yellow-400/80 text-xs font-mono tracking-widest uppercase">
                        AI Growth and Connection
                    </div>
                </div>

                {/* Background glow behind graphic */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full -z-10" />
            </div>
        </div>
    );
};

export default Hero;
