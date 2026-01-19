import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="text-2xl font-bold bg-yellow-400 text-black px-2 py-1 rounded inline-block mb-4">
                            Switch
                        </Link>
                        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                            Empowering career transitions with AI-driven resume optimization and skill placement modules.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link></li>
                            <li><Link to="/optimize" className="hover:text-yellow-400 transition-colors">Resume Optimizer</Link></li>
                            <li><Link to="/profile" className="hover:text-yellow-400 transition-colors">Profile Manager</Link></li>
                            <li><Link to="/modules" className="hover:text-yellow-400 transition-colors">Modules</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-yellow-400 hover:text-black transition-all group">
                                <Github size={18} />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-yellow-400 hover:text-black transition-all group">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-yellow-400 hover:text-black transition-all group">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Switch Platform. All rights reserved.</p>
                    <p className="flex items-center gap-1 mt-2 md:mt-0">
                        Made with <Heart size={12} className="text-red-500 fill-red-500" /> for Career Switchers
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
