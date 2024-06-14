// // // import React from 'react'
// // // import './Navbar.css';
// // // import { Navbar, Nav, Container, Form, FormControl, Button } from "react-bootstrap";
// // // import { Link, useNavigate } from "react-router-dom";
// // // import { useUserAuth } from "../../context/UserAuthContext";
// // // import Search from "../Search/Search";

// // // const MyNavbar = () => {
// // //     const { user, logOut } = useUserAuth();
// // //     const navigate = useNavigate();

// // //     const handleLogout = async () => {
// // //       try {
// // //         await logOut();
// // //         navigate("/login");
// // //       } catch (error) {
// // //         console.error("Error logging out:", error);
// // //       }
// // //     };

// // //     return (
// // //       <nav className="navbar">
// // //         <div className="navbar-container">
// // //           <div className="navbar-brand">
// // //             <Link to="/">MyApp</Link>
// // //           </div>
// // //           <div className="navbar-search">
// // //             <Search />
// // //           </div>
// // //           <div className="navbar-menu">
// // //             <Link to="/home">Home</Link>
// // //             <Link to="/about">About</Link>
// // //             <Link to="/contact">Contact</Link>
// // //           </div>
// // //           <div className="navbar-auth">
// // //             {user ? (
// // //               <>
// // //                 <Link to="/profile">Profile</Link>
// // //                 <button onClick={handleLogout}>Logout</button>
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <Link to="/login">Login</Link>
// // //                 <Link to="/signup">Sign Up</Link>
// // //               </>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </nav>
// // //     );
// // //   };

// // //   export default MyNavbar;
// // // MyNavbar.js
// // import React,{useState} from 'react';
// // import './Navbar.css';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { useUserAuth } from '../../context/UserAuthContext';
// // import Search from '../Search/Search';

// // const MyNavbar = () => {
// //   const { user, logOut } = useUserAuth();
// //   const navigate = useNavigate();

// //   const handleLogout = async () => {
// //     try {
// //       await logOut();
// //       navigate('/login');
// //     } catch (error) {
// //       console.error('Error logging out:', error);
// //     }
// //   };
// //   const [showSidebar, setShowSidebar] = useState(true);

// //   const toggleSidebar = () => {
// //     setShowSidebar(!showSidebar);
// //   };
// //   const [showSearch, setShowSearch] = useState(false);
// //   const toggleSearch = () => {
// //     setShowSearch(!showSearch);
// //   };
// //   return (
// //     <nav className={showSidebar ? 'sidebar active' : 'sidebar'}>

// //       <div className="navbar-container">
// //         <div className="navbar-brand">
// //           <Link to="/">MyApp</Link>
// //         </div>
// //         <button className="toggle-btn" onClick={toggleSidebar}>
// //           &#9776;
// //         </button>
// //         {/* <div className="navbar-search">
// //           <Search />
// //         </div> */}
// //         <div className="navbar-menu">
// //           <Link to="/home" className="nav-link">
// //             <i className="material-symbols--home"></i>
// //           </Link>
// //           <Link to="/about" className="nav-link">
// //             <i className="ph--plus-fill"></i>
// //           </Link>
// //           <Link to="/contact" className="nav-link">
// //             <i className="fe--messanger"></i>
// //           </Link>
// //           <Link to="/submenu1" className="nav-link">
// //             <i className="mage--video-player-fill"></i>
// //           </Link>
// //           <div className="dropdown">
// //             <Link to="#" className="nav-link" id="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
// //               <i className="mdi--view-dashboard"></i>
// //             </Link>
// //             <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdown">
// //               <li><Link className="dropdown-item" to="#">New project...</Link></li>
// //               <li><Link className="dropdown-item" to="#">Settings</Link></li>
// //               <li><Link className="dropdown-item" to="#">Profile</Link></li>
// //               <li><hr className="dropdown-divider" /></li>
// //               <li><Link className="dropdown-item" to="#">Sign out</Link></li>
// //             </ul>
// //           </div>
// //         </div>
// //         <div className="navbar-auth">
// //           {user ? (
// //             <>

// //               <button className="nav-link" onClick={handleLogout}>
// //                 Logout
// //               </button>
// //             </>
// //           ) : (
// //             <>
// //               <Link to="/login" className="nav-link">
// //                 Login
// //               </Link>
// //               <Link to="/signup" className="nav-link">
// //                 Sign Up
// //               </Link>
// //             </>
// //           )}
// //         </div>
// //         <div className="main-content">
// //         <button className="toggle-search-btn" onClick={toggleSearch}>
// //           <i className="search-icon"></i>
// //         </button>
// //         {showSearch && (
// //           <div className="search-container">
// //             <Search />
// //           </div>
// //         )}
// //         {/* Your main content here */}
// //         <h1>Main Content Area</h1>
// //         <p>This is where your main content will go.</p>
// //       </div>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default MyNavbar;
// // import React, { useState } from 'react';
// // import './Navbar.css';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { useUserAuth } from '../../context/UserAuthContext';
// // import Search from '../Search/Search';
// // import './Navbar1.css'
// // const MyNavbar = () => {
// //     const { user, logOut } = useUserAuth();
// //     const navigate = useNavigate();

// //     const handleLogout = async () => {
// //         try {
// //             await logOut();
// //             navigate('/login');
// //         } catch (error) {
// //             console.error('Error logging out:', error);
// //         }
// //     };

// //     const [showSidebar, setShowSidebar] = useState(true);
// //     const [showSearch, setShowSearch] = useState(false);

// //     const toggleSidebar = () => {
// //         setShowSidebar(!showSidebar);
// //     };

// //     const toggleSearch = () => {
// //         setShowSearch(!showSearch);
// //     };

// //     return (
// //         <nav className={showSidebar ? 'sidebar active' : 'sidebar'}>
// //             <div className="navbar-container">
// //                 <div className="navbar-brand">
// //                     <Link to="/">MyApp</Link>
// //                 </div>
// //                 <button className="toggle-btn" onClick={toggleSidebar}>
// //                     &#9776;
// //                 </button>
// //                 <div className="navbar-menu">
// //                     <Link to="/home" className="nav-link">
// //                         <i className="material-symbols--home"></i>
// //                         {/* Home */}
// //                     </Link>
// //                     <Link className="nav-link" onClick={toggleSearch}>
// //                         <i className="material-symbols--search"></i>
// //                     </Link>
// //                     {showSearch && (
// //                         <div className="search-container">
// //                             <Search />
// //                         </div>
// //                     )}
// //                     <Link to="/about" className="nav-link">
// //                         <i className="ph--plus-fill"></i>
// //                         {/* About */}
// //                     </Link>
// //                     <Link to="/contact" className="nav-link">
// //                         <i className="fe--messanger"></i>
// //                         {/* Contact */}
// //                     </Link>
// //                     <Link to="/videos" className="nav-link">
// //                         <i className="mage--video-player-fill"></i>
// //                         {/* Videos */}
// //                     </Link>
// //                     <div className="dropdown">
// //                         <Link
// //                             to="#"
// //                             className="nav-link"
// //                             id="dropdown"
// //                             data-bs-toggle="dropdown"
// //                             aria-expanded="false"
// //                         >
// //                             <i className="mdi--view-dashboard"></i>
// //                             {/* Dashboard */}
// //                         </Link>
// //                         <ul
// //                             className="dropdown-menu dropdown-menu-dark text-small shadow"
// //                             aria-labelledby="dropdown"
// //                         >
// //                             <li>
// //                                 <Link className="dropdown-item" to="#">
// //                                     New project...
// //                                 </Link>
// //                             </li>
// //                             <li>
// //                                 <Link className="dropdown-item" to="#">
// //                                     Settings
// //                                 </Link>
// //                             </li>
// //                             <li>
// //                                 <Link className="dropdown-item" to="#">
// //                                     Profile
// //                                 </Link>
// //                             </li>
// //                             <li>
// //                                 <hr className="dropdown-divider" />
// //                             </li>
// //                             <li>
// //                                 <Link className="dropdown-item" to="#" onClick={handleLogout}>
// //                                     Sign out
// //                                 </Link>
// //                             </li>
// //                         </ul>
// //                     </div>
// //                 </div>
// //                 <div className="navbar-auth">
// //                     {user ? (
// //                         <>
// //                             <button className="nav-link" onClick={handleLogout}>
// //                                 Logout
// //                             </button>
// //                         </>
// //                     ) : (
// //                         <>
// //                             <Link to="/login" className="nav-link">
// //                                 Login
// //                             </Link>
// //                             <Link to="/signup" className="nav-link">
// //                                 Sign Up
// //                             </Link>
// //                         </>
// //                     )}
// //                 </div>
// //             </div>
// //         </nav>
// //     );
// // };

// // export default MyNavbar;
// import React, { useState } from 'react';
// import './Navbar2.css';
// import { Link, useNavigate } from 'react-router-dom';
// import { useUserAuth } from '../../context/UserAuthContext';
// import Search from '../Search/Search';

// const MyNavbar = () => {
//     const { user, logOut } = useUserAuth();
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//         try {
//             await logOut();
//             navigate('/login');
//         } catch (error) {
//             console.error('Error logging out:', error);
//         }
//     };

//     const [showSidebar, setShowSidebar] = useState(true);
//     const [showSearch, setShowSearch] = useState(false);

//     const toggleSidebar = () => {
//         setShowSidebar(!showSidebar);
//     };

//     const toggleSearch = (event) => {
//         event.stopPropagation();
//         setShowSearch(!showSearch);
//     };
//     const handleSearchClick = (event) => {
//         event.stopPropagation();
//     };
//     return (
//         <nav className={showSidebar ? 'sidebar active' : 'sidebar'}>
//             <div className="navbar-container">
//                 <div className="navbar-brand">
//                     <Link to="/">MyApp</Link>
//                 </div>
//                 <button className="toggle-btn" onClick={toggleSidebar}>
//                     &#9776;
//                 </button>
//                 <div className="navbar-menu">
//                     <Link to="/home" className="nav-link">
//                         <i className="material-symbols--home"></i>
//                     </Link>
//                     {/* <Link className="nav-link search-link" onClick={toggleSearch}>
//                         <i className="mingcute--search-line"></i>
//                         {showSearch && (
//                             <div className="search-container">
//                                 <Search />
//                             </div>
//                         )}
//                     </Link> */}
//                     <Link className="nav-link search-link" onClick={toggleSearch}>
//                         <i className="mingcute--search-line"></i>
//                         {showSearch && (
//                             <div className="search-bar-overlay" onClick={handleSearchClick}>
//                                 <Search />
//                             </div>
//                         )}
//                     </Link>
//                     <Link to="/about" className="nav-link">
//                         <i className="ph--plus-fill"></i>
//                     </Link>
//                     <Link to="/contact" className="nav-link">
//                         <i className="fe--messanger"></i>
//                     </Link>
//                     <Link to="/videos" className="nav-link">
//                         <i className="mage--video-player-fill"></i>
//                     </Link>
//                     <div className="dropdown">
//                         <Link
//                             to="#"
//                             className="nav-link"
//                             id="dropdown"
//                             data-bs-toggle="dropdown"
//                             aria-expanded="false"
//                         >
//                             <i className="mdi--view-dashboard"></i>
//                         </Link>
//                         <ul
//                             className="dropdown-menu dropdown-menu-dark text-small shadow"
//                             aria-labelledby="dropdown"
//                         >
//                             <li>
//                                 <Link className="dropdown-item" to="#">
//                                     New project...
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link className="dropdown-item" to="#">
//                                     Settings
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link className="dropdown-item" to="#">
//                                     Profile
//                                 </Link>
//                             </li>
//                             <li>
//                                 <hr className="dropdown-divider" />
//                             </li>
//                             <li>
//                                 <Link className="dropdown-item" to="#" onClick={handleLogout}>
//                                     Sign out
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//                 <div className="navbar-auth">
//                     {user ? (
//                         <>
//                             <button className="nav-link" onClick={handleLogout}>
//                                 Logout
//                             </button>
//                         </>
//                     ) : (
//                         <>
//                             <Link to="/login" className="nav-link">
//                                 Login
//                             </Link>
//                             <Link to="/signup" className="nav-link">
//                                 Sign Up
//                             </Link>
//                         </>
//                     )}
//                 </div>
//             </div>
//             {/* {showSearch && (
//                 <div className="search-bar-overlay">
//                     <div className="search-container">
//                         <Search />
//                     </div>
//                 </div>
//             )} */}
//         </nav>
//     );
// };

// export default MyNavbar;

// {/* <button className="toggle-search-btn" onClick={toggleSearch}>
//     <i className="search-icon"></i>
// </button> */}
// {/* {showSearch && (
//     <div className="search-container">
//         <Search />
//     </div>
// )} */}
/*recent-1*/
import React, { useState } from 'react';
import './Navbar2.css';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import Search from '../Search/Search';

const MyNavbar = () => {
    const { user, logOut } = useUserAuth();
    const navigate = useNavigate();

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

    const handleSearchClick = (event) => {
        // event.stopPropagation();
    };

    return (
        <nav className={showSidebar ? 'sidebar active' : 'sidebar'}>
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/home">LinkSpace</Link>
                </div>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    &#9776;
                </button>
                <div className="navbar-menu">
                    <Link to="/home" className="nav-link">
                        <i className="material-symbols--home"></i>
                    </Link>
                    <Link className="nav-link search-link" onClick={toggleSearch}>
                        <i className="mingcute--search-line"></i>
                    </Link>
                    <div className='zzz'>
                        {showSearch && (
                            <div className="" onClick={handleSearchClick}>
                                <Search />
                            </div>
                        )}
                    </div>
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
                        <>
                            <button className="nav-link" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
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
/*recent-1*/
/*recent*/
// import React, { useState } from 'react';
// import './Navbar.css';
// import { Link, useNavigate } from 'react-router-dom';
// import { useUserAuth } from '../../context/UserAuthContext';
// import Search from '../Search/Search';

// const MyNavbar = () => {
//     const { user, logOut } = useUserAuth();
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//         try {
//             await logOut();
//             navigate('/login');
//         } catch (error) {
//             console.error('Error logging out:', error);
//         }
//     };

//     const [showSidebar, setShowSidebar] = useState(true);
//     const [showSearch, setShowSearch] = useState(false);

//     const toggleSidebar = () => {
//         setShowSidebar(!showSidebar);
//     };

//     const toggleSearch = () => {
//         setShowSearch(!showSearch);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Implement your search logic here
//         console.log('Performing search...');
//     };

//     return (
//         <nav className={showSidebar ? 'sidebar active' : 'sidebar'}>
//             <div className="navbar-container">
//                 <div className="navbar-brand">
//                     <Link to="/home">LinkSpace</Link>
//                 </div>
//                 <button className="toggle-btn" onClick={toggleSidebar}>
//                     &#9776;
//                 </button>
//                 <div className="navbar-menu">
//                     <Link to="/home" className="nav-link">
//                         <i className="material-symbols--home"></i>
//                         {/* Home */}
//                     </Link>
//                     <Link className="search-bar" onSubmit={handleSubmit}>
//                         <Search/>
//                     </Link>
//                     <Link to="/about" className="nav-link">
//                         <i className="ph--plus-fill"></i>
//                         {/* About */}
//                     </Link>
//                     <Link to="/contact" className="nav-link">
//                         <i className="fe--messanger"></i>
//                         {/* Contact */}
//                     </Link>
//                     <Link to="/videos" className="nav-link">
//                         <i className="mage--video-player-fill"></i>
//                         {/* Videos */}
//                     </Link>
//                     <div className="dropdown">
//                         <Link
//                             to="#"
//                             className="nav-link"
//                             id="dropdown"
//                             data-bs-toggle="dropdown"
//                             aria-expanded="false"
//                         >
//                             <i className="mdi--view-dashboard"></i>
//                             {/* Dashboard */}
//                         </Link>
//                         <ul
//                             className="dropdown-menu dropdown-menu-dark text-small shadow"
//                             aria-labelledby="dropdown"
//                         >
//                             <li>
//                                 <Link className="dropdown-item" to="#">
//                                     New project...
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link className="dropdown-item" to="#">
//                                     Settings
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link className="dropdown-item" to="#">
//                                     Profile
//                                 </Link>
//                             </li>
//                             <li>
//                                 <hr className="dropdown-divider" />
//                             </li>
//                             <li>
//                                 <Link
//                                     className="dropdown-item"
//                                     to="#"
//                                     onClick={handleLogout}
//                                 >
//                                     Sign out
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//                 <div className="navbar-auth">
//                     {user ? (
//                         <>
//                             <button className="nav-link" onClick={handleLogout}>
//                                 Logout
//                             </button>
//                         </>
//                     ) : (
//                         <>
//                             <Link to="/login" className="nav-link">
//                                 Login
//                             </Link>
//                             <Link to="/signup" className="nav-link">
//                                 Sign Up
//                             </Link>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default MyNavbar;
/*recent*/