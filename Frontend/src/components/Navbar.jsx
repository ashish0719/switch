import { Link } from 'react-router-dom';

const Navbar = () => {
    const navLinks = ['Placement', 'Modules', 'Jobs', 'Notes'];

    // Check auth
    let user = null;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        console.error("Error parsing user from localStorage", e);
        localStorage.removeItem('user'); // Clear invalid data
    }
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    };

    return (
        <nav className="flex items-center justify-between py-6 px-4 md:px-12 relative z-50">
            <Link to="/" className="text-2xl font-bold text-yellow-400 tracking-tight">
                Switch
            </Link>

            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                    <Link
                        key={link}
                        to={link === 'Notes' ? '/notes' : '#'}
                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        {link}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                {!user ? (
                    <>
                        <Link to="/login" className="hidden md:block text-sm font-medium text-gray-300 hover:text-white">Login</Link>
                        <Link to="/register" className="hidden md:block px-6 py-2.5 bg-white/10 text-white text-center text-sm font-semibold rounded-full hover:bg-white/20 transition-all">
                            Register
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/profile" className="text-yellow-400 text-sm font-medium hover:underline">
                            Hello, {user.name}
                        </Link>
                        <button onClick={handleLogout} className="text-sm font-medium text-gray-400 hover:text-white">Logout</button>
                    </div>
                )}
                <Link to="/optimize" className="hidden md:block px-6 py-2.5 bg-yellow-400 text-black text-center text-sm font-semibold rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
                    Optimize Resume
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
