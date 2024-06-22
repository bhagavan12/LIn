// import React, { useState, useEffect } from "react";
// import { MDBContainer, MDBRow, MDBCol, MDBCardImage, MDBModal, MDBModalBody } from "mdb-react-ui-kit";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import { useUserAuth } from "../context/UserAuthContext";

// const PostList = () => {
//   const { userDataf } = useUserAuth();
//   const [posts, setPosts] = useState([]);
//   const [modalPost, setModalPost] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const { uid } = await userDataf();
//         const q = query(collection(db, "posts"), where("uid", "==", uid));
//         const querySnapshot = await getDocs(q);
//         const fetchedPosts = [];
//         querySnapshot.forEach((doc) => {
//           fetchedPosts.push({ id: doc.id, ...doc.data() });
//         });
//         setPosts(fetchedPosts);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       }
//     };
//     fetchPosts();
//   }, [userDataf]);

//   const handlePostClick = (post) => {
//     setModalPost(post);
//     setShowModal(true);
//   };

//   return (
//     <div>
//       <MDBContainer>
//         <MDBRow>
//           {posts.map((post) => (
//             <MDBCol key={post.id} className="mb-2" onClick={() => handlePostClick(post)}>
//               <MDBCardImage src={post.imageuploaded[0]} alt={`Post ${post.id}`} className="w-100 rounded-3" />
//             </MDBCol>
//           ))}
//         </MDBRow>
//       </MDBContainer>

//       {/* Modal to display post details */}
//       <MDBModal show={showModal} onHide={() => setShowModal(false)}>
//         <MDBModalBody>
//           {modalPost && (
//             <div>
//               <h5>{modalPost.caption}</h5>
//               {/* Display other post details */}
//             </div>
//           )}
//         </MDBModalBody>
//       </MDBModal>
//     </div>
//   );
// };

// export default PostList;
// import React, { useState, useEffect } from "react";
// import { MDBContainer, MDBRow, MDBCol, MDBCardImage, MDBModal } from "mdb-react-ui-kit";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import { useUserAuth } from "../context/UserAuthContext";
// import Modal from "react-bootstrap/Modal";
// import { Button } from 'react-bootstrap';

// const PostList = () => {
//   const { userDataf } = useUserAuth();
//   const [posts, setPosts] = useState([]);
//   const [modalPost, setModalPost] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const { uid } = await userDataf();
//         const q = query(collection(db, "posts"), where("uid", "==", uid));
//         const querySnapshot = await getDocs(q);
//         const fetchedPosts = [];
//         querySnapshot.forEach((doc) => {
//           fetchedPosts.push({ id: doc.id, ...doc.data() });
//         });
//         setPosts(fetchedPosts);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       }
//     };
//     fetchPosts();
//   }, [userDataf]);

//   const handlePostClick = (post) => {
//     setModalPost(post);
//     setShowModal(true);
//   };

//   return (
//     <div>
//       <MDBContainer>
//         <MDBRow>
//           {posts.map((post) => (
//             <MDBCol key={post.id} className="mb-2" onClick={() => handlePostClick(post)}>
//               <MDBCardImage
//                 src={post.imageuploaded[0]}
//                 alt={`Post ${post.id}`}
//                 className="w-100 rounded-3"
//                 style={{ width: "450px", height: "330px", cursor: "pointer" }}
//               />
//             </MDBCol>
//           ))}
//         </MDBRow>
//       </MDBContainer>

//       {/* Modal using React Bootstrap */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Post Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {modalPost && (
//             <div>
//               <h5>{modalPost.caption}</h5>
//               {/* Display other post details */}
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default PostList;
// import React, { useState, useEffect } from "react";
// import { MDBContainer, MDBRow, MDBCol, MDBCardImage } from "mdb-react-ui-kit";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import { useUserAuth } from "../context/UserAuthContext";
// import Modal from "react-bootstrap/Modal";
// import { Button } from "react-bootstrap";

// const PostList = () => {
//     const { userDataf } = useUserAuth();
//     const [posts, setPosts] = useState([]);
//     const [modalPost, setModalPost] = useState(null);
//     const [showModal, setShowModal] = useState(false);

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const { uid } = await userDataf();
//                 const q = query(collection(db, "posts"), where("uid", "==", uid));
//                 const querySnapshot = await getDocs(q);
//                 const fetchedPosts = [];
//                 querySnapshot.forEach((doc) => {
//                     fetchedPosts.push({ id: doc.id, ...doc.data() });
//                 });
//                 setPosts(fetchedPosts);
//             } catch (error) {
//                 console.error("Error fetching posts:", error);
//             }
//         };
//         fetchPosts();
//     }, [userDataf]);

//     const handlePostClick = (post) => {
//         setModalPost(post);
//         setShowModal(true);
//     };
//     // const [activeIndex, setActiveIndex] = useState(0);

//     const [index, setIndex] =useState(0);

//   const handleSelect = (selectedIndex, e) => {
//     setIndex(selectedIndex);
//   };
//     return (
//         <div>
//             <MDBContainer>
//                 <MDBRow>
//                     {posts.map((post) => (
//                         <MDBCol key={post.id} className="mb-2" onClick={() => handlePostClick(post)}>
//                             <MDBCardImage
//                                 src={post.imageuploaded[0]}
//                                 alt={`Post ${post.id}`}
//                                 className="w-100 rounded-3"
//                                 style={{ width: "450px", height: "330px", cursor: "pointer" }}
//                             />
//                         </MDBCol>
//                     ))}
//                 </MDBRow>
//             </MDBContainer>

//             {/* Modal using React Bootstrap */}
//             <Modal show={showModal} onHide={() => setShowModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Post Details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {modalPost && (
//                         <div>
//                             <p>Username: {modalPost.username}</p>
//                             <p>Date: {new Date(modalPost.timestamp?.seconds * 1000).toLocaleString()}</p>
//                             {/* Display images in a Bootstrap Carousel */}
//                             {modalPost.imageuploaded.length > 0 && (
//                                 <div id="postCarousel" className="carousel slide" data-bs-ride="carousel">
//                                     {/* <div className="carousel-inner">
//                                         {modalPost.imageuploaded.map((image, index) => (
//                                             <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
//                                                 <img src={image} className="d-block w-100" alt={`Post ${modalPost.id} Image ${index}`} />
//                                             </div>
//                                         ))}
//                                     </div> */}
//                                     <div className="carousel-inner">
//                                         {modalPost.imageuploaded && modalPost.imageuploaded.length > 0 ? (
//                                             modalPost.imageuploaded.map((image, index) => (
//                                                 <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
//                                                     <img src={image} className="d-block w-100" alt={`Post ${modalPost.id} Image ${index}`} />
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <div className="carousel-item active">
//                                                 {/* Placeholder image or message when no images */}
//                                                 <img src="placeholder.jpg" className="d-block w-100" alt="No Image" />
//                                             </div>
//                                         )}
//                                     </div>
//                                     <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
//                                         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//                                         <span className="visually-hidden">Previous</span>
//                                     </button>
//                                     <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
//                                         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//                                         <span className="visually-hidden">Next</span>
//                                     </button>
//                                 </div>
//                             )}
//                             <h5>{modalPost.caption}</h5>
//                             <p>Likes: {modalPost.likes}</p>
//                         </div>
//                     )}
//                 </Modal.Body>

//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default PostList;
import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBCardImage } from "mdb-react-ui-kit";
import './PostShow.css';
import { MDBCardVideo } from 'mdbreact';

import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase";
import { db } from "../firebase";
import { useUserAuth } from "../context/UserAuthContext";
import Modal from "react-bootstrap/Modal";
import { Button, Carousel } from "react-bootstrap"; // Import Carousel from react-bootstrap
import ReactPlayer from 'react-player';
// Import ExampleCarouselImage or replace it with your image component
// import ExampleCarouselImage from "./ExampleCarouselImage"; 

const PostList = () => {
    const { userDataf } = useUserAuth();
    const { user } = useUserAuth();
    const [posts, setPosts] = useState([]);
    const [modalPost, setModalPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [index, setIndex] = useState(0);
    const [friendsPosts, setFriendsPosts] = useState([]);
    const [usernamee, setUsernamee] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null); // State for profile image URL
    const [comments, setComments] = useState({});
    const [commentInput, setCommentInput] = useState('');
    const [editingComment, setEditingComment] = useState({ postId: null, commentId: null });
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { uid, username } = await userDataf();
                setProfileImageUrl(await getProfileImageUrl(uid));
                setUsernamee(username);
                const q = query(collection(db, "posts"), where("uid", "==", uid));
                const querySnapshot = await getDocs(q);
                const fetchedPosts = [];
                querySnapshot.forEach((doc) => {
                    fetchedPosts.push({ id: doc.id, ...doc.data() });
                });
                const sortedPosts = fetchedPosts.sort((a, b) => b.createdAt - a.createdAt);

                setPosts(sortedPosts);
                ////
                const initialComments = {};
                fetchedPosts.forEach(post => {
                    initialComments[post.id] = post.comments || [];
                });
                setComments(initialComments);
                ////
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, [userDataf, comments]);

    const handlePostClick = (post) => {
        setModalPost(post);
        setShowModal(true);
    };

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    const formatDate = (timestamp) => {
        const dateObj = timestamp?.toDate(); // Convert Firestore timestamp to Date object
        return dateObj ? dateObj.toLocaleString() : "";
    };
    const getProfileImageUrl = async (userId) => {
        try {
            const folderRef = ref(storage, `profile_photos/${userId}/`);
            const filesList = await listAll(folderRef);

            // Get the first file URL from the list
            if (filesList.items.length > 0) {
                const firstFileRef = filesList.items[0];
                const url = await getDownloadURL(firstFileRef);
                return url;
            } else {
                return null; // No files found in the folder
            }
        } catch (error) {
            console.error("Error fetching profile image:", error);
            return null;
        }
    };
    const isVideoUrl = (url) => {
        return url.includes('.mp4');
    };
    const handleLikeToggle = async (post) => {
        const { uid, username } = await userDataf();
        const postRef = doc(db, 'posts', post.id);
        const updatedLikedBy = post.likedBy || [];

        if (updatedLikedBy.includes(uid)) {
            updatedLikedBy.splice(updatedLikedBy.indexOf(uid), 1);
            await updateDoc(postRef, {
                likes: post.likes - 1,
                likedBy: updatedLikedBy
            });
            post.likes -= 1;
        } else {
            updatedLikedBy.push(uid);
            await updateDoc(postRef, {
                likes: post.likes + 1,
                likedBy: updatedLikedBy
            });
            post.likes += 1;
        }

        setFriendsPosts((prevPosts) =>
            prevPosts.map((p) => (p.id === post.id ? { ...p, likes: post.likes, likedBy: updatedLikedBy } : p))
        );
    };
    const formatTimeDifference = (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp * 1000; // Convert seconds to milliseconds

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
        if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    };
    const handleCommentSubmit = async (post) => {
        if (!commentInput.trim()) return;

        try {
            const postRef = doc(db, 'posts', post.id);
            const newComment = {
                userId: user.uid,
                username: user.displayName,
                comment: commentInput,
                createdAt: new Date()
            };

            const updatedComments = [...(comments[post.id] || []), newComment];
            await updateDoc(postRef, { comments: updatedComments });

            setCommentInput('');
            setComments((prevComments) => ({
                ...prevComments,
                [post.id]: updatedComments
            }));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleEditComment = (postId, commentId, commentText) => {
        setEditingComment({ postId, commentId });
        setCommentInput(commentText);
    };
    const handleUpdateComment = async (post) => {
        if (!commentInput.trim()) return;

        try {
            const postRef = doc(db, 'posts', post.id);

            // Get the current sorted comments
            const sortedComments = comments[post.id]?.slice().sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

            // Find the correct index in sorted comments
            const sortedIndex = sortedComments.findIndex(sc => sc.comment === comments[post.id][editingComment.commentId].comment);
            // console.log()
            // Update the comment in the original comments state based on sorted index
            const updatedComments = comments[post.id].map((comment, index) => {
                if (index === sortedIndex) {
                    return { ...comment, comment: commentInput };
                } else {
                    return comment;
                }
            });

            // Update the Firestore document with the updated comments
            await updateDoc(postRef, { comments: updatedComments });

            // Reset editing state and clear comment input
            setEditingComment({ postId: null, commentId: null });
            setCommentInput('');

            // Update the local state with the updated comments
            setComments((prevComments) => ({
                ...prevComments,
                [post.id]: updatedComments,
            }));
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };
    const handleDeleteComment = async (postId, commentIndex) => {
        try {
            const postRef = doc(db, 'posts', postId);

            // Get the current sorted comments
            const sortedComments = comments[postId]?.slice().sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

            // Find the correct index in sorted comments
            const commentToDelete = sortedComments[commentIndex];

            // Update the original comments state by removing the comment
            const updatedComments = comments[postId].filter((comment) => comment.comment !== commentToDelete.comment);

            // Update the Firestore document with the updated comments
            await updateDoc(postRef, { comments: updatedComments });

            // Update the local state with the updated comments
            setComments((prevComments) => ({
                ...prevComments,
                [postId]: updatedComments,
            }));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };
    const renderComments = (post) => {
        // Sort comments by createdAt property in descending order (latest first)
        const sortedComments = comments[post.id]?.slice().sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

        return sortedComments && sortedComments.map((comment, index) => (
            <div key={index} className="edit-container" style={{ borderBottom: "1px solid rgb(204, 197, 197)" }}>
                <p style={{ margin: "auto 0px" }}><strong>{comment.username}</strong>: {comment.comment}</p>
                {comment.userId === user.uid && (
                    <div>
                        <i className='hugeicons--pencil-edit-02 edit_properties' onClick={() => handleEditComment(post.id, index, comment.comment)} style={{ width: "20px", height: "20px" }}></i>
                        <i className='ic--twotone-delete edit_properties' onClick={() => handleDeleteComment(post.id, index)} style={{ width: "20px", height: "20px" }}></i>
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div>
            {/* <MDBContainer>
                <MDBRow className="row-cols-1 row-cols-sm-2 row-cols-lg-3 g-5">
                    {posts.map((post) => (
                        <MDBCol key={post.id}>
                            {isVideoUrl(post.imageuploaded[0]) ? (
                                <MDBCardVideo
                                    src={post.imageuploaded[0]}
                                    className="w-100 rounded-3"
                                    onClick={() => handlePostClick(post)}
                                />
                            ) : (


                                <MDBCardImage
                                    src={post.imageuploaded[0]}
                                    alt={`Post ${post.id}`}
                                    className="w-100 rounded-3"
                                    style={{ width: "450px", height: "330px", cursor: "pointer" }}
                                    onClick={() => handlePostClick(post)}
                                />
                            )}
                        </MDBCol>
                    ))}
                </MDBRow>
            </MDBContainer> */}
            <div className='postfeed'>

                <div className='postsgrid'>
                    {posts.map((post, index) => (
                        <div>
                            {isVideoUrl(post.imageuploaded[0]) ? (
                                <div key={index} className='postcont'>
                                    <MDBCardVideo
                                        src={post.imageuploaded[0]}
                                        // className="w-100 rounded-3"
                                        className="posts"
                                        onClick={() => handlePostClick(post)}
                                    />
                                </div>
                            ) : (
                                <div key={index} className='postcont'>
                                    <img
                                        src={post.imageuploaded[0]}
                                        alt={`Post ${post.id}`}
                                        className="posts"
                                        // style={{ width: "450px", height: "330px", cursor: "pointer" }}
                                        onClick={() => handlePostClick(post)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal using React Bootstrap */}
            <Modal show={showModal} onHide={() => setShowModal(false)} >
                {/* <Modal.Header closeButton>
                    {modalPost && (
                        <Modal.Title className="d-flex align-items-center">
                            <img
                                src={profileImageUrl}
                                className="rounded-circle mr-2"
                                height="45"
                                alt="Avatar"
                                loading="lazy"
                            />
                            <div style={{marginLeft:"10px",border:"1px solid black"}}>
                            <p style={{ fontSize: "25px", marginLeft: "5px", paddingTop: "2px" }}>{usernamee}</p>
                            <p style={{ fontSize: "15px", marginLeft: "5px", paddingTop: "5px" }}>{formatTimeDifference(modalPost.createdAt.seconds)}</p>
                            </div>
                        </Modal.Title>
                    )}
                </Modal.Header> */}
                {/* <Modal.Body > */}
                {modalPost && (
                    <div className='' style={{ padding: "5px" }}>
                        <div className="post-header">
                            <img src={profileImageUrl} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                            <div>
                                <h3 id="uname">{usernamee}</h3>
                                <h6 style={{ paddingLeft: "12px" }} id=''>{formatTimeDifference(modalPost.createdAt.seconds)}</h6>
                                {/* <h6 id="uname">{new Date(post.createdAt.seconds * 1000).toLocaleString()}</h6> */}
                            </div>
                        </div>
                        {/* <p>Date: {formatDate(modalPost.timestamp)}</p> */}
                        {/* Display images in a Bootstrap Carousel */}
                        <Carousel activeIndex={index} onSelect={handleSelect}>
                            {modalPost.imageuploaded.map((mediaUrl, idx) => (
                                <Carousel.Item key={idx}>
                                    {/* <img src={image} className="d-block w-100" alt={`Post ${modalPost.id} Image ${idx}`} /> */}
                                    {isVideoUrl(mediaUrl) ? (
                                        <ReactPlayer url={mediaUrl} controls width="100%" height="auto" />
                                    ) : (
                                        <img src={mediaUrl} className="d-block w-100" alt={`Post ${modalPost.id} Image ${idx}`} />
                                    )}
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        <div className="like-section">
                            <span
                                className={`like-button`}
                            // onClick={() => handleLikeToggle(post)}
                            >
                                <i className={modalPost.likedBy && modalPost.likedBy.includes(modalPost.uid) ? 'icon-park-solid--like' : 'icon-park-outline--like1'} onClick={() => handleLikeToggle(modalPost)}></i>
                            </span>
                            <span className="comment-icon">
                                <i className="iconamoon--comment-thin" data-bs-toggle="collapse" href={`#collapse${modalPost.id}`} role="button" aria-expanded="false" aria-controls={`collapse${modalPost.id}`}></i>
                            </span>
                        </div>
                        <p>{modalPost.likes} Likes</p>
                        <p><span id='uname1'>{modalPost.username}</span> {modalPost.caption}</p>
                        <div className="collapse" id={`collapse${modalPost.id}`}>
                            <div style={{ maxHeight: "120px", overflow: "auto", marginBottom: "2px" }}>
                                {renderComments(modalPost)}
                            </div>
                            <input
                                type="text"
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                placeholder="Enter your comment"
                                className='input1'
                            />
                            {editingComment.postId === modalPost.id ? (
                                <button className='button_sub' onClick={() => handleUpdateComment(modalPost)}>Update</button>
                            ) : (
                                <button className='button_sub' onClick={() => handleCommentSubmit(modalPost)}>Comment</button>
                            )}
                        </div>
                    </div>
                )}
                {/* </Modal.Body> */}
                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer> */}
            </Modal>
        </div>
    );
};

export default PostList;
