import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden flex flex-col">
            <Navbar />

            <div className="flex-grow flex flex-col items-center justify-center relative z-10">

                {/* Simple CSS Running Character (Stick/Pixel Style) */}
                <div className="running-container mb-12 relative">
                    <div className="runner"></div>
                    <div className="track"></div>
                </div>

                <h1 className="text-[150px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-600 opacity-20 select-none">
                    404
                </h1>

                <div className="text-center space-y-6 -mt-10 z-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Lost somewhere in time?
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                        The page you are looking for has run away or never existed.
                    </p>

                    <Link
                        to="/"
                        className="inline-block px-8 py-3 bg-yellow-400 text-black font-bold rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] hover:-translate-y-1 transition-all duration-300"
                    >
                        Back to Home
                    </Link>
                </div>

            </div>

            {/* Decorative localized background blob */}
            <div className="fixed bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
};

export default NotFound;
