
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ActionCard = ({ title, icon: Icon, buttonText, isPrimary, progress, subtitle, link }) => {
    const CardContent = (
        <div className={`relative group p-6 rounded-3xl border transition-all duration-300 ease-in-out cursor-pointer
      ${isPrimary
                ? 'bg-gradient-to-br from-white/10 to-white/5 border-green-400/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
            } hover:scale-[1.02] backdrop-blur-xl flex flex-col justify-between h-64 overflow-hidden`}
        >
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/20 transition-all duration-500" />

            <div className="relative z-10">
                <div className="mb-4 text-white/90">
                    <Icon size={32} strokeWidth={1.5} className={isPrimary ? "text-yellow-400" : "text-gray-300"} />
                </div>
                <h3 className="text-xl font-medium text-white mb-1 group-hover:text-yellow-400 transition-colors">{title}</h3>
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>

            <div className="relative z-10">
                {progress ? (
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>38%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-700/50 rounded-full overflow-hidden">
                            <div className="h-full w-[38%] bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                        </div>
                    </div>
                ) : null}

                <button
                    className={`w-fit px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
            ${isPrimary
                            ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:bg-yellow-300'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
                        }`}
                >
                    {buttonText} <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );

    return link ? <Link to={link} className="block">{CardContent}</Link> : CardContent;
};

export default ActionCard;
