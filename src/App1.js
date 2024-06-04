import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Post from './Post';
import { Container, Row, Col } from "react-bootstrap";
import App from './App';
import Login from './components/Login';
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from './components/Signup';
import { UserAuthContextProvider } from './context/UserAuthContext'; // Import the context provider
import Profile from './components/scrap/Profile';
import ProfileNPost from './components/scrap/ProfileNPost';
import ProfilePage from './components/scrap/Profilepage';
import Mdb from './components/mdbprofile';
import UserPost from './components/UserPost';
import PostShow from './components/PostShow';
import Search from './components/Search/Search';
import Profiles from './components/Search/Profiles';
import Notification from './components/Notifications';
const App1=()=>{
  return (
    // <Container style={{ width: "400px" }}>
    //   <Row>
    //     <Col>
          <UserAuthContextProvider>
            <Routes>
              <Route
                path="/post"
                element={
                  <ProtectedRoute>
                    <Post />
                  </ProtectedRoute>
                }
              />
              {/* <Route path="/post" element={<Post/>}/> */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup/>}/>
              <Route path='/profile' element={<Profile/>}/>
              <Route path='/pnp' element={<ProfileNPost/>}/>
              <Route path='/prouse' element={<ProfilePage/>}/>
              <Route path='/mdb' element={<Mdb/>}/>
              <Route path='/userpost' element={<UserPost/>}/>
              <Route path='/posts' element={<PostShow/>}/>
              <Route path='/search' element={<Search/>}/>
              <Route path="/userprofile/:userId" element={<Profiles />}/>
              <Route path="/notifications/:userId" element={<Notification/>}/>
            </Routes>
          </UserAuthContextProvider>
    //     </Col>
    //   </Row>
    // </Container>
  );
}

export default App1;

