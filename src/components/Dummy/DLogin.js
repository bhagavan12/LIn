// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Form, Alert } from "react-bootstrap";
// import { Button } from "react-bootstrap";
// import GoogleButton from "react-google-button";
// import { useUserAuth } from "../../context/UserAuthContext";
// import Cookies from "js-cookie";
// import logo from '../ass/fontbolt.png';
// import phone from '../ass/loginphone.png'
// import './DLogin.css';
// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [name, setName] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const { logIn, googleSignIn, user } = useUserAuth(); // Get the user from context
//     const navigate = useNavigate();

//     useEffect(() => {
//         const sessionToken = Cookies.get("session_token");
//         if (sessionToken && user) {
//             // If a session token exists and user is set, redirect to the appropriate page
//             if (user.email === "admin@gmail.com") {
//                 navigate("/result");
//             } else {
//                 navigate("/home");
//             }
//         }
//     }, [user, navigate]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         try {
//             await logIn(email, password);
//             if (email === "admin@gmail.com") {
//                 navigate("/result");
//             } else {
//                 navigate("/home");
//             }
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     const handleGoogleSignIn = async (e) => {
//         e.preventDefault();
//         try {
//             await googleSignIn();
//             navigate("/post");
//         } catch (error) {
//             setError(error.message);
//         }
//     };
//     const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 600);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobileView(window.innerWidth <= 600);
//         };

//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);
//     return (
//         <div className="login-container">
//             {!isMobileView && <img src={phone} className="login-image" alt="phone" />}

//             <div className="formc">
//                 <div className="p-4 box formcard">

//                     {/* <h2 className="mb-6" style={{textAlign:"center",color:"black",fontFamily:"Billabong"}}>LinkSpace</h2> */}
//                     <img src={logo} className="logols"></img>
//                     {error && <Alert variant="danger">{error}</Alert>}

//                     <form className="" onSubmit={handleSubmit}>
//                         {/* <Form.Group className="mb-3" controlId="formBasicName">
//             <Form.Control
//               type="name"
//               placeholder="Enter Name"
//               onChange={(e) => setName(e.target.value)}
//             />
//           </Form.Group> */}
//                         <Form.Group className="mb-3 formin" controlId="formBasicEmail">
//                             <Form.Control
//                                 type="email"
//                                 placeholder="Email address"
//                                 onChange={(e) => setEmail(e.target.value)}
//                             />
//                         </Form.Group>

//                         <Form.Group className="mb-3 formin" controlId="formBasicPassword">
//                             <Form.Control
//                                 type="password"
//                                 placeholder="Password"
//                                 onChange={(e) => setPassword(e.target.value)}
//                             />
//                         </Form.Group>

//                         <div className="d-grid formin">
//                             <button className="submitb" type="Submit">
//                                 Log In
//                             </button>
//                         </div>
//                     </form>
//                     <hr />

//                 </div>
//                 <div className="p-4 box mt-3 text-center formcard">
//                     Don't have an account? <Link to="/signup">Sign up</Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../../context/UserAuthContext";
import Cookies from "js-cookie";
import logo from '../ass/fontbolt.png';
import phone from '../ass/loginphone1.png'
import './DLogin.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { logIn, googleSignIn, user } = useUserAuth();
    const navigate = useNavigate();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 600);

    useEffect(() => {
        const sessionToken = Cookies.get("session_token");
        if (sessionToken && user) {
            if (user.email === "admin@gmail.com") {
                navigate("/result");
            } else {
                navigate("/home");
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 600);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await logIn(email, password);
            if (email === "admin@gmail.com") {
                navigate("/result");
            } else {
                navigate("/home");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        try {
            await googleSignIn();
            navigate("/post");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            {!isMobileView && <img src={phone} className="login-image" alt="phone" />}
            <div className="form-container">
                <div className="p-4 box form-card">
                    <img src={logo} className="logo" alt="logo" />
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3 form-input" controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 form-input" controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <div className="d-grid form-input">
                            <button className="submit-button" type="submit">
                                Log In
                            </button>
                        </div>
                    </form>
                    <hr />
                        <p style={{textAlign:"center",fontSize:"x-small"}}>currently login with email</p>
                    <div className="google-button-container">
                        <GoogleButton
                            className="g-btn"
                            type="dark"
                            // onClick={handleGoogleSignIn}
                        />
                    </div>
                </div>
                <div className="p-4 box mt-3 text-center form-card">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
