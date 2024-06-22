// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Post from './Post';
// import { Container, Row, Col } from "react-bootstrap";
// import App from './App';
// import Login from './components/Login';
// import ProtectedRoute from "./components/ProtectedRoute";
// import Signup from './components/Signup';
// import { UserAuthContextProvider } from './context/UserAuthContext'; // Import the context provider

// import Mdb from './components/mdbprofile';
// import UserPost from './components/UserPost';
// import PostShow from './components/PostShow';
// import Search from './components/Search/Search';
// import Profiles from './components/Search/Profiles';
// import Notification from './components/Notifications';
// import Home from './components/HomeFeed/Homefeed';
// import Navbar from './components/Navbar/Navbar';
// const App1=()=>{
//   return (
//     // <Container style={{ width: "400px" }}>
//     //   <Row>
//     //     <Col>
//           <UserAuthContextProvider>
//             <Routes>

//               <Route
//                 path="/post"
//                 element={
//                   <ProtectedRoute>
//                     <Post />
//                   </ProtectedRoute>
//                 }
//               />
//               {/* <Route path="/post" element={<Post/>}/> */}
//               <Route path="/" element={<Navbar/>} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup/>}/>
//               {/* <Route path='/profile' element={<Profile/>}/> */}
//               {/* <Route path='/pnp' element={<ProfileNPost/>}/> */}
//               {/* <Route path='/prouse' element={<ProfilePage/>}/> */}
//               <Route path='/mdb' element={<Mdb/>}/>
//               <Route path='/userpost' element={<UserPost/>}/>
//               <Route path='/posts' element={<PostShow/>}/>
//               <Route path='/search' element={<Search/>}/>
//               <Route path='/home' element={<Home/>}/>
//               <Route path="/userprofile/:userId" element={<Profiles />}/>
//               <Route path="/notifications/:userId" element={<Notification/>}/>
//             </Routes>
//           </UserAuthContextProvider>
//   );
// }

// export default App1;
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Post from './Post';
import App from './App';
import Login from './components/Login';
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from './components/Signup';
import { UserAuthContextProvider, useUserAuth } from './context/UserAuthContext';
import Mdb from './components/Profile/Profile';
import UserPost from './components/UserPost';
import PostShow from './components/PostShow';
import Search from './components/Search/Search';
import Profiles from './components/Search/Profiles';
import Notification from './components/Notifications/Notifications';
import Home from './components/HomeFeed/Homefeed';
import Navbar from './components/Navbar/Navbar';
// import DLogin from './components/Dummy/DLogin';
import './App.css'; // Import your CSS file for general styles

const AppContent = () => {
  const { user } = useUserAuth();
  const [yes, setYes] = useState(user);
  useEffect(() => {
    setYes(user);
  }, [user]);
  return (
    <>
      {yes && <Navbar />}
      <div className={yes ? "main-content" : ""}>
        <Routes>
          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <Post />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Login />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path='/mdb' element={<Mdb />} />
          <Route path='/userpost' element={<UserPost />} />
          <Route path='/posts' element={<PostShow />} />
          <Route path='/search' element={<Search />} />
          <Route path='/home' element={<Home />} />
          <Route path="/userprofile/:userId" element={<Profiles />} />
          <Route path="/notifications" element={<Notification />} />
        </Routes>
      </div>
    </>
  );
};

const App1 = () => {
  return (
    <UserAuthContextProvider>
      {/* <Router> */}
      <AppContent />
      {/* </Router>/\ */}
    </UserAuthContextProvider>
  );
};

export default App1;


// //     </Col>
// //   </Row>
// // </Container>