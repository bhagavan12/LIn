import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy,updateDoc,doc } from 'firebase/firestore';
import { ref, getDownloadURL, listAll ,getMetadata} from "firebase/storage";
import { storage, db } from "../../firebase";
import { useUserAuth } from "../../context/UserAuthContext";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomeFeed.css';
import Navbar from '../Navbar/Navbar';
const FriendsPosts = () => {
  const { user } = useUserAuth();
  const [uuid,setUuid]=useState('');
  const [friendsPosts, setFriendsPosts] = useState([]);
  const [friendsUIDs, setFriendsUIDs] = useState([]);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

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

            if (!postsSnapshot.empty){
              return postsSnapshot.docs.map(async (doc) => {
                const postData = doc.data();
                const profileImageUrl = await getProfileImageUrl(postData.uid);
                console.log("profileImageUrl:",profileImageUrl,"for",postData.uid);
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
        } else {
          console.log("No friends found for user:", user.uid);
        }
      } catch (error) {
        console.error('Error fetching friends posts:', error);
      }
    };

    fetchFriendsPosts();
  }, [user]);

  // Function to get profile image URL from Firebase Storage
  const getProfileImageUrl = async (userId) => {
    try {
      const folderRef = ref(storage, `profile_photos/${userId}/`);
      console.log("folderRef",folderRef);
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
                  <h6 style={{paddingLeft:"12px"}} id=''>{formatTimeDifference(post.createdAt.seconds)}</h6>
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
                  <i className="iconamoon--comment-thin"></i>
                </span>
              </div>
              <p>{post.likes} Likes</p>
              <p><span id='uname1'>{post.username}</span> {post.caption}</p>
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
// const FriendsPosts = () => {
//   const { user } = useUserAuth();
//   const [friendsPosts, setFriendsPosts] = useState([]);
//   const [friendsUIDs, setFriendsUIDs] = useState([]);

//   useEffect(() => {
//     const fetchFriendsPosts = async () => {
//       if (!user) return;

//       try {
//         console.log("Fetching friends for user:", user.uid);

//         // Step 1: Get the user's friends' UIDs from the 'friends' collection
//         const friendsQuery = query(collection(db, 'friends'), where('userId', '==', user.uid));
//         const friendsSnapshot = await getDocs(friendsQuery);
//         // console.log(friendsSnapshot);
//         if (!friendsSnapshot.empty) {
//           const friendsDoc = friendsSnapshot.docs[0];
//           // console.log("friendsDoc",friendsDoc);
//           const friendsData = friendsDoc.data();
//           // console.log("friendsData",friendsData);
//           const friendsUIDs = friendsData.friends;

//           console.log("Friends UIDs:", friendsUIDs);
//           setFriendsUIDs(friendsUIDs);

//           // Step 2: Fetch posts for each friend's UID
//           const postsPromises = friendsUIDs.map(async (friendUid) => {
//             console.log("friendUid",friendUid);
//             const postsQuery = query(
//               collection(db, 'posts'),
//               where('uid', '==', friendUid),
//               // orderBy('createdAt', 'desc')
//             );
//             const postsSnapshot = await getDocs(postsQuery);

//             if (!postsSnapshot.empty) {
//               return postsSnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//               }));
//             } else {
//               return []; // Return an empty array if no posts found for the friend
//             }
//           });

//            // Resolve all promises and flatten the results into a single array
//            const postsArray = await Promise.all(postsPromises);
//            const flattenedPosts = postsArray.flat();
 
//            // Log each post's createdAt value for debugging
//            flattenedPosts.forEach(post => {
//              console.log(`Post ID: ${post.id}, createdAt:`, post.createdAt);
//            });
 
//            // Sort the posts by createdAt in descending order
//            const sortedPosts = flattenedPosts.sort((a, b) => {
//             const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
//             const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
//             return dateB - dateA;
//           });
//           console.log("after sorted")
//           sortedPosts.forEach(post => {
//             console.log(`Post ID: ${post.id}, createdAt:`, post.createdAt);
//           });
 
//            console.log("Friends posts:", sortedPosts);
//            setFriendsPosts(sortedPosts);
//         } else {
//           console.log("No friends found for user:", user.uid);
//         }
//       } catch (error) {
//         console.error('Error fetching friends posts:', error);
//       }
//     };

//     fetchFriendsPosts();
//   }, [user]);
//   const sliderSettings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1
//   };
//   return (
//     <div>
//       <h2>Friends' Posts</h2>
//       <div>
//         {/* <h3>Friends UIDs: {friendsUIDs.join(', ')}</h3> */}
//         {friendsPosts.length > 0 ? (
//           friendsPosts.map(post => (
//             <div className="postcard" key={post.id}>
//               <h3 id="uname">{post.username}</h3>
//               <p>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
//               {post.imageuploaded.length > 1 ? (
//                 <Slider {...sliderSettings}>
//                   {post.imageuploaded.map((image, index) => (
//                     <div key={index}>
//                       <img src={image} alt={`Image ${index}`} style={{ width: '100%' }} />
//                     </div>
//                   ))}
//                 </Slider>
//               ) : (
//                 post.imageuploaded.map((image, index) => (
//                   <img key={index} src={image} alt={`Image ${index}`} style={{ width: '100%' }} />
//                 ))
//               )}
//               <p>Likes: {post.likes}</p>
//               <p>{post.caption}</p>
//             </div>
            
//           ))
//         ) : (
//           <p>No posts from friends.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FriendsPosts;

// const FriendsPosts = () => {
//     const { user } = useUserAuth();
//     const [friendsPosts, setFriendsPosts] = useState([]);
//     const [friendsUIDs, setFriendsUIDs] = useState([]);
  
//     useEffect(() => {
//       const fetchFriendsPosts = async () => {
//         if (!user) return;
  
//         try {
//           console.log("Fetching friends for user:", user.uid);
  
//           // Step 1: Get the user's friends' UIDs from the 'friends' collection
//           const friendsQuery = query(collection(db, 'friends'), where('userId', '==', user.uid));
//           console.log("friendsQuery:",friendsQuery);
//           const friendsSnapshot = await getDocs(friendsQuery);
  
//           if (!friendsSnapshot.empty) {
//             const friendsDoc = friendsSnapshot.docs[0];
//             const friendsData = friendsDoc.data();
//             const friendsUIDs = friendsData.friends;
  
//             console.log("Friends UIDs:", friendsUIDs);
//             setFriendsUIDs(friendsUIDs);
  
//             // Step 2: Fetch posts for each friend's UID
//             const postsPromises = friendsUIDs.map(async (friendUid) => {
//               const postsQuery = query(
//                 collection(db, 'posts'),
//                 where('uid', '==', friendUid),
//                 orderBy('createdAt', 'desc')
//               );
//               const postsSnapshot = await getDocs(postsQuery);
  
//               if (!postsSnapshot.empty) {
//                 return postsSnapshot.docs.map(doc => ({
//                   id: doc.id,
//                   ...doc.data()
//                 }));
//               } else {
//                 return []; // Return an empty array if no posts found for the friend
//               }
//             });
  
//             // Resolve all promises and flatten the results into a single array
//             const postsArray = await Promise.all(postsPromises);
//             const flattenedPosts = postsArray.flat();
  
//             console.log("Friends posts:", flattenedPosts);
//             setFriendsPosts(flattenedPosts);
//           } else {
//             console.log("No friends found for user:", user.uid);
//           }
//         } catch (error) {
//           console.error('Error fetching friends posts:', error);
//         }
//       };
  
//       fetchFriendsPosts();
//     }, [user]);
  
//     return (
//       <div>
//         <h2>Friends' Posts</h2>
//         <div>
//           <h3>Friends UIDs: {friendsUIDs.join(', ')}</h3>
//           {friendsPosts.length > 0 ? (
//             friendsPosts.map(post => (
//               <div key={post.id}>
//                 <h3>{post.username}</h3>
//                 <p>{post.caption}</p>
//                 <p>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
//                 {post.imageuploaded.map((image, index) => (
//                   <img key={index} src={image} alt="post" style={{ width: '200px' }} />
//                 ))}
//                 <p>Likes: {post.likes}</p>
//               </div>
//             ))
//           ) : (
//             <p>No posts from friends.</p>
//           )}
//         </div>
//       </div>
//     );
//   };
  
//   export default FriendsPosts;
// const FriendsPosts = () => {
//     const { user } = useUserAuth();
//     const [friendsPosts, setFriendsPosts] = useState([]);
//     const [friendsUIDs, setFriendsUIDs] = useState([]);
  
//     useEffect(() => {
//       const fetchFriendsPosts = async () => {
//         if (!user) return;
  
//         try {
//           console.log("Fetching friends for user:", user.uid);
  
//           // Step 1: Get the user's friends' UIDs from the 'friends' collection
//           const friendsQuery = query(collection(db, 'friends'), where('userId', '==', user.uid));
//           const friendsSnapshot = await getDocs(friendsQuery);
  
//           if (!friendsSnapshot.empty) {
//             const friendsDoc = friendsSnapshot.docs[0];
//             const friendsData = friendsDoc.data();
//             const friendsUIDs = friendsData.friends;
  
//             console.log("Friends UIDs:", friendsUIDs);
//             setFriendsUIDs(friendsUIDs);
  
//             // Step 2: Fetch posts for each friend's UID
//             const postsPromises = friendsUIDs.map(async (friendUid) => {
//               const postsQuery = query(
//                 collection(db, 'posts'),
//                 where('uid', '==', friendUid),
//                 orderBy('createdAt', 'desc')
//               );
//               const postsSnapshot = await getDocs(postsQuery);
//               console.log("friends posts",postsSnapshot)
//               if (!postsSnapshot.empty) {
//                 return postsSnapshot.docs.map(doc => ({
//                   id: doc.id,
//                   ...doc.data()
//                 }));
//               } else {
//                 return []; // Return an empty array if no posts found for the friend
//               }
//             });
  
//             // Resolve all promises and flatten the results into a single array
//             const postsArray = await Promise.all(postsPromises);
//             const flattenedPosts = postsArray.flat();
  
//             console.log("Friends posts:", flattenedPosts);
//             setFriendsPosts(flattenedPosts);
//           } else {
//             console.log("No friends found for user:", user.uid);
//           }
//         } catch (error) {
//           console.error('Error fetching friends posts:', error);
//         }
//       };
  
//       fetchFriendsPosts();
//     }, [user]);
  
//     return (
//       <div>
//         <h2>Friends' Posts</h2>
//         <div>
//           <h3>Friends UIDs: {friendsUIDs.join(', ')}</h3>
//           {friendsPosts.length > 0 ? (
//             friendsPosts.map(post => (
//               <div key={post.id}>
//                 <h3>{post.username}</h3>
//                 <p>{post.caption}</p>
//                 <p>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
//                 {post.imageuploaded.map((image, index) => (
//                   <img key={index} src={image} alt="post" style={{ width: '200px' }} />
//                 ))}
//                 <p>Likes: {post.likes}</p>
//               </div>
//             ))
//           ) : (
//             <p>No posts from friends.</p>
//           )}
//         </div>
//       </div>
//     );
//   };
  
//   export default FriendsPosts;
// const FriendsPosts = () => {
//     const { user } = useUserAuth();
//     const [friendsPosts, setFriendsPosts] = useState([]);
//     const [friendsUIDs, setFriendsUIDs] = useState([]);
  
//     useEffect(() => {
//       const fetchFriendsPosts = async () => {
//         if (!user) return;
  
//         try {
//           console.log("Fetching friends for user:", user.uid);
  
//           // Step 1: Get the user's friends' UIDs from the 'friends' collection
//           const friendsQuery = query(collection(db, 'friends'), where('userId', '==', user.uid));
//           const friendsSnapshot = await getDocs(friendsQuery);
  
//           if (!friendsSnapshot.empty) {
//             const friendsDoc = friendsSnapshot.docs[0];
//             const friendsData = friendsDoc.data();
//             const friendsUIDs = friendsData.friends;
  
//             console.log("Friends UIDs:", friendsUIDs);
//             setFriendsUIDs(friendsUIDs);
  
//             // Step 2: Fetch posts for each friend's UID
//             const postsPromises = friendsUIDs.map(async (friendUid) => {
//               const postsQuery = query(
//                 collection(db, 'posts'),
//                 where('uid', '==', friendUid),
//                 orderBy('createdAt', 'desc')
//               );
//               const postsSnapshot = await getDocs(postsQuery);
  
//               if (!postsSnapshot.empty) {
//                 return postsSnapshot.docs.map(doc => ({
//                   id: doc.id,
//                   ...doc.data()
//                 }));
//               } else {
//                 return []; // Return an empty array if no posts found for the friend
//               }
//             });
  
//             // Resolve all promises and flatten the results into a single array
//             const postsArray = await Promise.all(postsPromises);
//             const flattenedPosts = postsArray.flat();
  
//             console.log("Friends posts:", flattenedPosts);
//             setFriendsPosts(flattenedPosts);
//           } else {
//             console.log("No friends found for user:", user.uid);
//           }
//         } catch (error) {
//           console.error('Error fetching friends posts:', error);
//         }
//       };
  
//       fetchFriendsPosts();
//     }, [user]);
  
//     return (
//       <div>
//         <h2>Friends' Posts</h2>
//         <div>
//           <h3>Friends UIDs: {friendsUIDs.join(', ')}</h3>
//           {friendsPosts.length > 0 ? (
//             friendsPosts.map(post => (
//               <div key={post.id}>
//                 <h3>{post.username}</h3>
//                 <p>{post.caption}</p>
//                 <p>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
//                 {post.imageuploaded.map((image, index) => (
//                   <img key={index} src={image} alt="post" style={{ width: '200px' }} />
//                 ))}
//                 <p>Likes: {post.likes}</p>
//               </div>
//             ))
//           ) : (
//             <p>No posts from friends.</p>
//           )}
//         </div>
//       </div>
//     );
//   };
  
//   export default FriendsPosts;
// const FriendsPosts = () => {
//     const { user } = useUserAuth();
//     const [friendsPosts, setFriendsPosts] = useState([]);
//     const [friendsUIDs, setFriendsUIDs] = useState([]);
  
//     useEffect(() => {
//       const fetchFriendsPosts = async () => {
//         if (!user) return;
  
//         try {
//           console.log("Fetching friends for user:", user.uid);
  
//           // Step 1: Get the user's friends' UIDs from the 'friends' collection
//           const friendsQuery = query(collection(db, 'friends'), where('userId', '==', user.uid));
//           const friendsSnapshot = await getDocs(friendsQuery);
  
//           if (!friendsSnapshot.empty) {
//             const friendsDoc = friendsSnapshot.docs[0];
//             const friendsData = friendsDoc.data();
//             const friendsUIDs = friendsData.friends;
  
//             console.log("Friends UIDs:", friendsUIDs);
//             setFriendsUIDs(friendsUIDs);
  
//             // Step 2: Fetch posts for each friend's UID
//             const postsPromises = friendsUIDs.map(async (friendUid) => {
//               const postsQuery = query(
//                 collection(db, 'posts'),
//                 where('uid', '==', friendUid),
//                 orderBy('createdAt', 'desc')
//               );
//               const postsSnapshot = await getDocs(postsQuery);
  
//               if (!postsSnapshot.empty) {
//                 return postsSnapshot.docs.map(doc => ({
//                   id: doc.id,
//                   ...doc.data()
//                 }));
//               } else {
//                 return []; // Return an empty array if no posts found for the friend
//               }
//             });
  
//             // Resolve all promises and flatten the results into a single array
//             const postsArray = await Promise.all(postsPromises);
//             const flattenedPosts = postsArray.flat();
  
//             console.log("Friends posts:", flattenedPosts);
//             setFriendsPosts(flattenedPosts);
//           } else {
//             console.log("No friends found for user:", user.uid);
//           }
//         } catch (error) {
//           console.error('Error fetching friends posts:', error);
//         }
//       };
  
//       fetchFriendsPosts();
//     }, [user]);
  
//     return (
//       <div>
//         <h2>Friends' Posts</h2>
//         <div>
//           <h3>Friends UIDs: {friendsUIDs.join(', ')}</h3>
//           {friendsPosts.length > 0 ? (
//             friendsPosts.map(post => (
//               <div key={post.id}>
//                 <h3>{post.username}</h3>
//                 <p>{post.caption}</p>
//                 <p>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
//                 {post.imageuploaded.map((image, index) => (
//                   <img key={index} src={image} alt="post" style={{ width: '200px' }} />
//                 ))}
//                 <p>Likes: {post.likes}</p>
//               </div>
//             ))
//           ) : (
//             <p>No posts from friends.</p>
//           )}
//         </div>
//       </div>
//     );
//   };
  
//   export default FriendsPosts;
// const FriendsPosts = () => {
//     const { user } = useUserAuth();
//     const [friendsPosts, setFriendsPosts] = useState([]);
//     const [friendsUIDs, setFriendsUIDs] = useState([]);
  
//     useEffect(() => {
//       const fetchFriendsPosts = async () => {
//         if (!user) return;
  
//         try {
//           console.log("Fetching friends for user:", user.uid);
  
//           const friendsQuery = query(collection(db, 'friends'), where('userId', '==', user.uid));
//           const friendsSnapshot = await getDocs(friendsQuery);
  
//           if (!friendsSnapshot.empty) {
//             const friendsDoc = friendsSnapshot.docs[0];
//             const friendsData = friendsDoc.data();
//             const friendsUIDs = friendsData.friends;
  
//             console.log("Friends UIDs:", friendsUIDs);
//             setFriendsUIDs(friendsUIDs);
  
//             if (friendsUIDs.length > 0) {
//               const postsQuery = query(
//                 collection(db, 'posts'),
//                 where('uid', 'in', friendsUIDs),
//                 orderBy('createdAt', 'desc')
//               );
//               const postsSnapshot = await getDocs(postsQuery);
  
//               if (postsSnapshot.empty) {
//                 console.log("No posts found for friends:", friendsUIDs);
//               } else {
//                 const posts = postsSnapshot.docs.map(doc => ({
//                   id: doc.id,
//                   ...doc.data()
//                 }));
  
//                 console.log("Friends posts:", posts);
//                 setFriendsPosts(posts);
//               }
//             }
//           } else {
//             console.log("No friends found for user:", user.uid);
//           }
//         } catch (error) {
//           console.error('Error fetching friends posts:', error);
//         }
//       };
  
//       fetchFriendsPosts();
//     }, [user]);
  
//     return (
//       <div>
//         <h2>Friends' Posts</h2>
//         <div>
//           <h3>Friends UIDs: {friendsUIDs.join(', ')}</h3>
//           {friendsPosts.length > 0 ? (
//             friendsPosts.map(post => (
//               <div key={post.id}>
//                 <h3>{post.username}</h3>
//                 <p>{post.caption}</p>
//                 <p>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
//                 {post.imageuploaded.map((image, index) => (
//                   <img key={index} src={image} alt="post" style={{ width: '200px' }} />
//                 ))}
//                 <p>Likes: {post.likes}</p>
//               </div>
//             ))
//           ) : (
//             <p>No posts from friends.</p>
//           )}
//         </div>
//       </div>
//     );
//   };
  
//   export default FriendsPosts;
  
// const FriendsPosts = () => {
//   const { user } = useUserAuth();
//   const [friendsPosts, setFriendsPosts] = useState([]);

//   useEffect(() => {
//     const fetchFriendsPosts = async () => {
//       if (!user) return;

//       try {
//         // Step 1: Get the user's friends' UIDs from the 'friends' collection
//         const friendsQuery = query(collection(db, 'friends'), where('userId', '==', user.uid));
//         const friendsSnapshot = await getDocs(friendsQuery);

//         if (!friendsSnapshot.empty) {
//           const friendsDoc = friendsSnapshot.docs[0];
//           const friendsData = friendsDoc.data();
//           const friendsUIDs = friendsData.friends;

//           // Step 2: Query posts created by these friends
//           const postsQuery = query(
//             collection(db, 'posts'),
//             where('uid', 'in', friendsUIDs),
//             orderBy('createdAt', 'desc')
//           );
//           const postsSnapshot = await getDocs(postsQuery);

//           const posts = postsSnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//           }));

//           // Step 3: Set the posts to state
//           setFriendsPosts(posts);
//         }
//       } catch (error) {
//         console.error('Error fetching friends posts:', error);
//       }
//     };

//     fetchFriendsPosts();
//   }, [user]);

//   return (
//     <div>
//       <h2>Friends' Posts</h2>
//       <div>
//         {friendsPosts.length > 0 ? (
//           friendsPosts.map(post => (
//             <div key={post.id}>
//               <h3>{post.username}</h3>
//               <p>{post.caption}</p>
//               <p>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
//               {post.imageuploaded.map((image, index) => (
//                 <img key={index} src={image} alt="post" style={{ width: '200px' }} />
//               ))}
//               <p>Likes: {post.likes}</p>
//             </div>
//           ))
//         ) : (
//           <p>No posts from friends.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FriendsPosts;
