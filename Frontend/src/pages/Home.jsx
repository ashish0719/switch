import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

import ActionCard from '../components/ActionCard';
import { FileText, Briefcase, User, GraduationCap } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden">
            <div className="max-w-7xl mx-auto relative">
                {/* Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px]" />
                    <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-yellow-400/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 flex flex-col min-h-screen">
                    <Navbar />

                    <main className="flex-grow flex flex-col pb-20">
                        <Hero />

                        <div className="px-4 md:px-12 -mt-8 max-w-6xl mx-auto w-full">
                            <h2 className="text-2xl font-bold mb-6 text-gray-200">Tools & Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                <ActionCard
                                    title="Resume Optimizer"
                                    subtitle="Tailor your resume for any JD using AI."
                                    icon={FileText}
                                    buttonText="Optimize Now"
                                    isPrimary={true}
                                    link="/optimize"
                                />

                                <ActionCard
                                    title="Profile Manager"
                                    subtitle="Manage your projects, certifications & links."
                                    icon={User}
                                    buttonText="Edit Profile"
                                    isPrimary={false}
                                    link="/profile"
                                />

                                <ActionCard
                                    title="Placement Modules"
                                    subtitle="Master technical skills & prepare for interviews."
                                    icon={GraduationCap}
                                    buttonText="Explore Modules"
                                    isPrimary={false}
                                    progress={true}
                                    link="/modules" // Placeholder
                                />

                            </div>
                        </div>
                    </main>

                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Home;
