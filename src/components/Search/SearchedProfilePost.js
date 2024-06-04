import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBCardImage } from "mdb-react-ui-kit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
// import { useUserAuth } from "../context/UserAuthContext";
import Modal from "react-bootstrap/Modal";
import { Button, Carousel } from "react-bootstrap"; // Import Carousel from react-bootstrap
// Import ExampleCarouselImage or replace it with your image component
// import ExampleCarouselImage from "./ExampleCarouselImage"; 

const PostList = ({ location, userId }) => {
    // const { userDataf } = useUserAuth();
    const [posts, setPosts] = useState([]);
    const [modalPost, setModalPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() =>{
        const fetchPosts = async () => {
            try {
                // const { uid } = await userDataf();
                const q = query(collection(db, "posts"), where("uid", "==", userId));
                const querySnapshot = await getDocs(q);
                const fetchedPosts = [];
                querySnapshot.forEach((doc) => {
                    fetchedPosts.push({ id: doc.id, ...doc.data() });
                });
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, [location]);

    const handlePostClick = (post) => {
        setModalPost(post);
        setShowModal(true);
    };

    const handleSelect = (selectedIndex, e)=>{
        setIndex(selectedIndex);
    };
    const formatDate = (timestamp) =>{
        const dateObj = timestamp?.toDate(); // Convert Firestore timestamp to Date object
        return dateObj ? dateObj.toLocaleString() : "";
    };

    return (
        <div>
            <MDBContainer>
                <MDBRow className="row-cols-1 row-cols-sm-2 row-cols-lg-3 g-5">
                    {posts.map((post) => (
                        <MDBCol key={post.id}>
                            <MDBCardImage
                                src={post.imageuploaded[0]}
                                alt={`Post ${post.id}`}
                                className="w-100 rounded-3"
                                style={{ width: "450px", height: "330px", cursor: "pointer" }}
                                onClick={() => handlePostClick(post)}
                            />
                        </MDBCol>
                    ))}
                </MDBRow>
            </MDBContainer>

            {/* Modal using React Bootstrap */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Post Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalPost && (
                        <div>
                            <p>Username: {modalPost.username}</p>
                            {/* <p>Date: {new Date(modalPost.timestamp?.seconds * 1000).toLocaleString()}</p> */}
                            <p>Date: {formatDate(modalPost.timestamp)}</p>
                            {/* Display images in a Bootstrap Carousel */}
                            <Carousel activeIndex={index} onSelect={handleSelect}>
                                {modalPost.imageuploaded.map((image, idx) => (
                                    <Carousel.Item key={idx}>
                                        <img src={image} className="d-block w-100" alt={`Post ${modalPost.id} Image ${idx}`} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                            <h5>{modalPost.caption}</h5>
                            <p>Likes: {modalPost.likes}</p>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PostList;
