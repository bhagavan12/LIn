// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Form, Alert, Button } from "react-bootstrap";
// import { useUserAuth } from "../context/UserAuthContext";

// const Signup = () =>{
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { signUp } = useUserAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       await signUp(email, password);
//       navigate("/"); // Redirect to homepage after successful signup
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="p-4 box">
//       <h2 className="mb-3">Sign Up</h2>
//       {error && <Alert variant="danger">{error}</Alert>}
//       <Form onSubmit={handleSubmit}>

//         <Form.Group className="mb-3" controlId="formBasicEmail">
//           <Form.Label>Email address</Form.Label>
//           <Form.Control
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </Form.Group>
//         <Form.Group className="mb-3" controlId="formBasicPassword">
//           <Form.Label>Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </Form.Group>
//         <Button variant="primary" type="submit">
//           Sign Up
//         </Button>
//       </Form>
//       <div className="mt-3">
//         Already have an account? <Link to="/login">Log In</Link>
//       </div>
//     </div>
//   );
// };

// export default Signup;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import './Login.css';
import logo from './ass/fontbolt.png';
import phone from './ass/loginphone2.png'
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useUserAuth();
  const navigate = useNavigate();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 600);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Pass additional user data along with email and password
      await signUp(email, password, fullName, username, dob, gender, "");
      navigate("/"); // Redirect to homepage after successful signup
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className="login-container">
      {!isMobileView && <img src={phone} className="login-image" alt="phone" />}
      <div className="form-container">
        {/* <h2 className="mb-3">Sign Up</h2> */}
        <div className="p-4 box form-card" >
          <img src={logo} className="logo" alt="logo" />
          {error && <Alert variant="danger">{error}</Alert>}
          <form onSubmit={handleSubmit} >
            <Form.Group className="mb-3 form-input" controlId="formBasicEmail">
              {/* <Form.Label>Email address</Form.Label> */}
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3 form-input" controlId="formBasicFullName">
              {/* <Form.Label>Full Name</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 form-input" controlId="formBasicUsername">
              {/* <Form.Label>Username</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 form-input" controlId="formBasicDOB">
              {/* <Form.Label>Date of Birth</Form.Label> */}
              <Form.Control
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 form-input" controlId="formBasicGender">
              {/* <Form.Label>Gender</Form.Label> */}
              <Form.Control
                as="select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3 form-input" controlId="formBasicPassword">
              {/* <Form.Label>Password</Form.Label> */}
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {/* Standard email and password input fields */}
            {/* Update your email and password input fields here */}
            <div className="d-grid form-input">
              <button className="submit-button" type="submit">
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div className="p-4 box mt-3 text-center form-card">
          Already have an account? <Link to="/">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
