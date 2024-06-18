import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../context/UserAuthContext";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn, user } = useUserAuth(); // Get the user from context
  const navigate = useNavigate();

  useEffect(() => {
    const sessionToken = Cookies.get("session_token");
    if (sessionToken && user) {
      // If a session token exists and user is set, redirect to the appropriate page
      if (user.email === "admin@gmail.com") {
        navigate("/result");
      } else {
        navigate("/home");
      }
    }
  }, [user, navigate]);

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
    <div style={{width:"400px",margin:"auto",border:"2px solid grey",borderRadius:"10px"}}>
      <div className="p-4 box">
      
        <h2 className="mb-3" style={{textAlign:"center"}}>LinkSpace</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Control
              type="name"
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Log In
            </Button>
          </div>
        </Form>
        <hr />
        {/* <div>
          <GoogleButton
            className="g-btn"
            type="dark"
            onClick={handleGoogleSignIn}
          />
        </div> */}
      </div>
      <div className="p-4 box mt-3 text-center">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
};

export default Login;

// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Form, Alert } from "react-bootstrap";
// import { Button } from "react-bootstrap";
// import GoogleButton from "react-google-button";
// import { useUserAuth } from "../context/UserAuthContext";
// import Cookies from "js-cookie";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { logIn, googleSignIn } = useUserAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check for the cookie on component mount
//     const sessionCookie = Cookies.get("session_token");
//     if (sessionCookie) {
//       // If cookie exists, navigate to the desired route
//       navigate("/home");
//     }
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await logIn(email, password, name);
//       // Set a cookie that expires in 30 minutes
//       Cookies.set("session_token", "your_session_token", { expires: 1 / 48 });
//       if (email === "admin@gmail.com") {
//         navigate("/result");
//       } else {
//         navigate("/home");
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleGoogleSignIn = async (e) => {
//     e.preventDefault();
//     try {
//       await googleSignIn();
//       // Set a cookie that expires in 30 minutes
//       Cookies.set("session_token", "your_session_token", { expires: 1 / 48 });
//       navigate("/post");
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   return (
//     <>
//       <div className="p-4 box">
//         <h2 className="mb-3">Cloud Voting App</h2>

//         {error && <Alert variant="danger">{error}</Alert>}

//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3" controlId="formBasicName">
//             <Form.Control
//               type="name"
//               placeholder="Enter Name"
//               onChange={(e) => setName(e.target.value)}
//             />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="formBasicEmail">
//             <Form.Control
//               type="email"
//               placeholder="Email address"
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="formBasicPassword">
//             <Form.Control
//               type="password"
//               placeholder="Password"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </Form.Group>

//           <div className="d-grid gap-2">
//             <Button variant="primary" type="Submit">
//               Log In
//             </Button>
//           </div>
//         </Form>
//         <hr />
//         <div>
//           <GoogleButton
//             className="g-btn"
//             type="dark"
//             onClick={handleGoogleSignIn}
//           />
//         </div>
//       </div>
//       <div className="p-4 box mt-3 text-center">
//         Don't have an account? <Link to="/signup">Sign up</Link>
//       </div>
//     </>
//   );
// };

// export default Login;

// // import React, { useState } from "react";
// // import { useNavigate ,Link} from "react-router-dom";
// // import { Form, Alert } from "react-bootstrap";
// // import { Button } from "react-bootstrap";
// // import GoogleButton from "react-google-button";
// // import { useUserAuth } from "../context/UserAuthContext";

// // const Login = () =>{
// //   const [email, setEmail] = useState("");
// //   const [name,setName] =useState("");
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState("");
// //   const { logIn, googleSignIn } = useUserAuth();
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     try {
// //       await logIn(email, password,name);
// //       // navigate("/home");
// //       if(email === "admin@gmail.com"){
// //         navigate("/result"); 
// //       }else{
// //         navigate("/home");
// //       }
// //     } catch (err) {
// //       setError(err.message);
// //     }
// //   };
  
// //   const handleGoogleSignIn = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await googleSignIn();
// //       navigate("/post");
// //     } catch (error) {
// //       console.log(error.message);
// //     }
// //   };

// //   return (
// //     <>
// //       <div className="p-4 box">
// //         <h2 className="mb-3">Cloud Voting App</h2>

// //         {error && <Alert variant="danger">{error}</Alert>}

// //         <Form onSubmit={handleSubmit}>
// //           <Form.Group className="mb-3" controlId="formBasicName">
// //             <Form.Control
// //               type="name"
// //               placeholder="Enter Name"
// //               onChange={(e) => setName(e.target.value)}
// //             />
// //           </Form.Group>
// //           <Form.Group className="mb-3" controlId="formBasicEmail">
// //             <Form.Control
// //               type="email"
// //               placeholder="Email address"
// //               onChange={(e) => setEmail(e.target.value)}
// //             />
// //           </Form.Group>

// //           <Form.Group className="mb-3" controlId="formBasicPassword">
// //             <Form.Control
// //               type="password"
// //               placeholder="Password"
// //               onChange={(e) => setPassword(e.target.value)}
// //             />
// //           </Form.Group>

// //           <div className="d-grid gap-2">
// //             <Button variant="primary" type="Submit">
// //               Log In
// //             </Button>
// //           </div>
// //         </Form>
// //         <hr />
// //         <div>
// //           <GoogleButton
// //             className="g-btn"
// //             type="dark"
// //             onClick={handleGoogleSignIn}
// //           />
// //         </div>
// //       </div>
// //       <div className="p-4 box mt-3 text-center">
// //         Don't have an account? <Link to="/signup">Sign up</Link>
// //       </div>
// //     </>
// //   );
// // };

// // export default Login;
