import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { storage, db } from "../../firebase";
import { useUserAuth } from "../../context/UserAuthContext";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomeFeed.css';
import Navbar from '../Navbar/Navbar';
const FriendsPosts = () => {
  const { user } = useUserAuth();
  const [uuid, setUuid] = useState('');
  const [friendsPosts, setFriendsPosts] = useState([]);
  const [friendsUIDs, setFriendsUIDs] = useState([]);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  // const [commentInput, setCommentInput] = useState('');
  // const [comments, setComments] = useState({});
  // const [editingCommentId, setEditingCommentId] = useState(null);
  // const [editedComment, setEditedComment] = useState('');
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState('');
  const [editingComment, setEditingComment] = useState({ postId: null, commentId: null });
  useEffect(() => {
    const fetchFriendsPosts = async () => {
      if (!user) return;

      try {
        setUuid(user.uid);
        // Step 1: Get the user's friends' UIDs from the 'friends' collection
        const friendsQuery = query(collection(db, 'friends'), where('userId', '==', user.uid));
        const friendsSnapshot = await getDocs(friendsQuery);

        if (!friendsSnapshot.empty) {
          const friendsDoc = friendsSnapshot.docs[0];
          const friendsData = friendsDoc.data();
          const friendsUIDs = friendsData.friends;
          setFriendsUIDs(friendsUIDs);

          // Step 2: Fetch posts for each friend's UID
          const postsPromises = friendsUIDs.map(async (friendUid) => {
            const postsQuery = query(collection(db, 'posts'), where('uid', '==', friendUid));
            const postsSnapshot = await getDocs(postsQuery);

            if (!postsSnapshot.empty) {
              return postsSnapshot.docs.map(async (doc) => {
                const postData = doc.data();
                const profileImageUrl = await getProfileImageUrl(postData.uid);
                console.log("profileImageUrl:", profileImageUrl, "for", postData.uid);
                return {
                  id: doc.id,
                  profileImageUrl,
                  ...postData
                };
              });
            } else {
              return []; // Return an empty array if no posts found for the friend
            }
          });

          // Resolve all promises and flatten the results into a single array
          const postsArray = await Promise.all(postsPromises.map(async (promise) => await Promise.all(await promise)));
          const flattenedPosts = postsArray.flat();

          // Sort the posts by createdAt in descending order
          const sortedPosts = flattenedPosts.sort((a, b) => b.createdAt - a.createdAt);
          setFriendsPosts(sortedPosts);
          ////
          const initialComments = {};
          flattenedPosts.forEach(post => {
            initialComments[post.id] = post.comments || [];
          });
          setComments(initialComments);
        } else {
          console.log("No friends found for user:", user.uid);
        }
      } catch (error) {
        console.error('Error fetching friends posts:', error);
      }
    };

    fetchFriendsPosts();
  }, [user, comments]);

  // Function to get profile image URL from Firebase Storage
  const getProfileImageUrl = async (userId) => {
    try {
      const folderRef = ref(storage, `profile_photos/${userId}/`);
      console.log("folderRef", folderRef);
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
  // const handleCommentSubmit = async (post) => {
  //   if (!commentInput.trim()) return;

  //   try {
  //     const postRef = doc(db, 'posts', post.id);
  //     const newComment = {
  //       userId: user.uid,
  //       username: user.displayName, // Assuming user's displayName is available
  //       comment: commentInput,
  //       createdAt: new Date()
  //     };

  //     const updatedComments = [...(post.comments || []), newComment];
  //     await updateDoc(postRef, { comments: updatedComments });

  //     setCommentInput('');
  //     setComments((prevComments) => ({
  //       ...prevComments,
  //       [post.id]: updatedComments
  //     }));
  //   } catch (error) {
  //     console.error('Error adding comment:', error);
  //   }
  // };
  // // const handleEditComment = (commentId, currentComment) => {
  // //   setEditingCommentId(commentId);
  // //   setEditedComment(currentComment);
  // // };

  // // const handleSaveEditedComment = async (post) => {
  // //   if (!editedComment.trim()) return;

  // //   try {
  // //     const postRef = doc(db, 'posts', post.id);
  // //     const updatedComments = post.comments.map((comment) =>
  // //       comment.createdAt === editingCommentId ? { ...comment, comment: editedComment } : comment
  // //     );

  // //     await updateDoc(postRef, { comments: updatedComments });

  // //     setEditingCommentId(null);
  // //     setEditedComment('');
  // //     setFriendsPosts((prevPosts) =>
  // //       prevPosts.map((p) => (p.id === post.id ? { ...p, comments: updatedComments } : p))
  // //     );
  // //   } catch (error) {
  // //     console.error('Error editing comment:', error);
  // //   }
  // // };
  // const handleEditComment = (commentId, currentComment) => {
  //   setEditingCommentId(commentId);
  //   setEditedComment(currentComment);
  // };

  // const handleSaveEditedComment = async (post) => {
  //   if (!editedComment.trim()) return;

  //   try {
  //     const postRef = doc(db, 'posts', post.id);
  //     const updatedComments = post.comments.map((comment) =>
  //       comment.createdAt === editingCommentId ? { ...comment, comment: editedComment } : comment
  //     );

  //     await updateDoc(postRef, { comments: updatedComments });

  //     setEditingCommentId(null);
  //     setEditedComment('');
  //     setComments((prevComments) => ({
  //       ...prevComments,
  //       [post.id]: updatedComments
  //     }));
  //   } catch (error) {
  //     console.error('Error editing comment:', error);
  //   }
  // };

  ////
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

  // const handleUpdateComment = async (post) => {
  //   if (!commentInput.trim()) return;

  //   try {
  //     const postRef = doc(db, 'posts', post.id);
  //     const updatedComments = comments[post.id].map((comment, index) =>
  //       index === editingComment.commentId
  //         ? { ...comment, comment: commentInput }
  //         : comment
  //     );

  //     await updateDoc(postRef, { comments: updatedComments });

  //     setEditingComment({ postId: null, commentId: null });
  //     setCommentInput('');
  //     setComments((prevComments) => ({
  //       ...prevComments,
  //       [post.id]: updatedComments
  //     }));
  //   } catch (error) {
  //     console.error('Error updating comment:', error);
  //   }
  // };
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

  // const renderComments = (post) => {
  //   return comments[post.id] && comments[post.id].map((comment, index) => (
  //     <div key={index} className="edit-container">
  //       <p><strong>{comment.username}</strong>: {comment.comment}</p>
  //       {comment.userId === user.uid && (

  //         <i className='hugeicons--pencil-edit-02 edit_properties' onClick={() => handleEditComment(post.id, index, comment.comment)}></i>
  //       )}
  //     </div>
  //   ));
  // };

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

  ////
  const handleLikeToggle = async (post) => {
    const postRef = doc(db, 'posts', post.id);
    const updatedLikedBy = post.likedBy || [];

    if (updatedLikedBy.includes(user.uid)) {
      updatedLikedBy.splice(updatedLikedBy.indexOf(user.uid), 1);
      await updateDoc(postRef, {
        likes: post.likes - 1,
        likedBy: updatedLikedBy
      });
      post.likes -= 1;
    } else {
      updatedLikedBy.push(user.uid);
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
  // Settings for react-slick carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
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

  return (
    <>

      {/* <Navbar/> */}
      <div className='centrr'>
        {/* <h2>Friends' Posts</h2> */}
        <div>
          {friendsPosts.length > 0 ? (
            friendsPosts.map(post => (
              <div className='postcard'>
                <div className="post-header">
                  <img src={post.profileImageUrl} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                  <div>
                    <h3 id="uname">{post.username}</h3>
                    <h6 style={{ paddingLeft: "12px" }} id=''>{formatTimeDifference(post.createdAt.seconds)}</h6>
                    {/* <h6 id="uname">{new Date(post.createdAt.seconds * 1000).toLocaleString()}</h6> */}
                  </div>
                </div>
                {post.imageuploaded.length > 1 ? (
                  <Slider {...sliderSettings}>
                    {post.imageuploaded.map((image, index) => (
                      <div className='imgbox' key={index}>
                        <img src={image} alt={`Image ${index}`} />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  post.imageuploaded.map((image, index) => (
                    <div className='imgbox' key={index}>
                      <img src={image} alt={`Image ${index}`} />
                    </div>
                  ))
                )}
                {/* <div className="like-section">
                <span
                  className={`like-button ${post.likedBy && post.likedBy.includes(user.uid) ? 'liked' : ''}`}
                  onClick={() => handleLikeToggle(post)}
                >
                  <i className={post.likedBy && post.likedBy.includes(user.uid) ? 'flat-color-icons--like' : 'icon-park-outline--like'}></i>
                </span>
              </div> */}
                <div className="like-section">
                  <span
                    className={`like-button`}
                  // onClick={() => handleLikeToggle(post)}
                  >
                    <i className={post.likedBy && post.likedBy.includes(uuid) ? 'icon-park-solid--like' : 'icon-park-outline--like1'} onClick={() => handleLikeToggle(post)}></i>
                  </span>
                  <span className="comment-icon">
                    <i className="iconamoon--comment-thin" data-bs-toggle="collapse" href={`#collapse${post.id}`} role="button" aria-expanded="false" aria-controls={`collapse${post.id}`}></i>
                  </span>
                </div>
                <p>{post.likes} Likes</p>
                <p><span id='uname1'>{post.username}</span> {post.caption}</p>

                <div className="collapse" id={`collapse${post.id}`}>
                  <div style={{ maxHeight: "120px", overflow: "auto", marginBottom:"2px"}}>
                    {renderComments(post)}
                  </div>
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Enter your comment"
                    className='input1'
                  />
                  {editingComment.postId === post.id ? (
                    <button className='button_sub' onClick={() => handleUpdateComment(post)}>Update</button>
                  ) : (
                    <button className='button_sub' onClick={() => handleCommentSubmit(post)}>Comment</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='centrr'>
              <div class="loader">
                <div class="wrapper">
                  <div class="circle"></div>
                  <div class="line-1"></div>
                  <div class="line-2"></div>
                  <div class="line-3"></div>
                  <div class="line-1"></div>
                  <div class="line-4"></div>
                </div>
              </div>
              <div class="loader">
                <div class="wrapper">
                  <div class="circle"></div>
                  <div class="line-1"></div>
                  <div class="line-2"></div>
                  <div class="line-3"></div>
                  <div class="line-4"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


export default FriendsPosts;

