import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import Search from '../Search/Search';

const MyNavbar = () => {
    const { user, logOut } = useUserAuth();
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const [showSidebar, setShowSidebar] = useState(true);
    const [showSearch, setShowSearch] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const toggleSearch = (event) => {
        event.stopPropagation();
        setShowSearch(!showSearch);
    };

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setShowSearch(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className={showSidebar ? 'sidebar active' : 'sidebar'}>
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/home">LS</Link>
                </div>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    &#9776;
                </button>
                <div className="navbar-menu">
                    <Link to="/home" className="nav-link">
                        <i className="material-symbols--home"></i>
                    </Link>
                    <div className="search-link" onClick={toggleSearch}>
                        <i className="mingcute--search-line"></i>
                    </div>
                    {showSearch && (
                        <div className="search-container" ref={searchRef}>
                            <Search />
                        </div>
                    )}
                    <Link to="/mdb" className="nav-link">
                        <i className="ph--plus-fill"></i>
                    </Link>
                    <Link to="/contact" className="nav-link">
                        <i className="fe--messanger"></i>
                    </Link>
                    <Link to="/videos" className="nav-link">
                        <i className="mage--video-player-fill"></i>
                    </Link>
                    <div className="dropdown">
                        <Link
                            to="#"
                            className="nav-link"
                            id="dropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="mdi--view-dashboard"></i>
                        </Link>
                        <ul
                            className="dropdown-menu dropdown-menu-dark text-small shadow"
                            aria-labelledby="dropdown"
                        >
                            <li>
                                <Link className="dropdown-item" to="#">
                                    New project...
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="#">
                                    Settings
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="#">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <Link className="dropdown-item" to="#" onClick={handleLogout}>
                                    Sign out
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="navbar-auth">
                    {user ? (
                        <button className="nav-link" onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                            <Link to="/signup" className="nav-link">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default MyNavbar;
