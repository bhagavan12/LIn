import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
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
  const [friendsPosts, setFriendsPosts] = useState([]);
  const [friendsUIDs, setFriendsUIDs] = useState([]);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const fetchFriendsPosts = async () => {
      if (!user) return;

      try {
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

  // Settings for react-slick carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <>

    {/* <Navbar/> */}
    <div>
      <h2>Friends' Posts</h2>
      <div>
        {friendsPosts.length > 0 ? (
          friendsPosts.map(post => (
            <div className='postcard' key={post.id}>
              <div className="post-header">
                <img src={post.profileImageUrl} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                <h3 id="uname">{post.username}</h3>
              </div>
              <p>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
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
              <p>Likes: {post.likes}</p>
              <p>{post.caption}</p>
            </div>
          ))
        ) : (
          <p>No posts from friends.</p>
        )}
      </div>
    </div>
    </>
  );
};
//     <div>
//       <h2>Friends' Posts</h2>
//       <div>
//         <h3>Friends UIDs: {friendsUIDs.join(', ')}</h3>
//         {friendsPosts.length > 0 ? (
//           friendsPosts.map(post => (
//             <div className='postcard' key={post.id}>
//               <h3 id="uname">{post.username}</h3>
//               <img src={post.profileImageUrl} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
//               <p>{post.caption}</p>
//               <p>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
//               {post.imageuploaded.length > 1 ? (
//                 <Slider {...sliderSettings}>
//                   {post.imageuploaded.map((image, index) => (
//                     <div className='imgbox' key={index}>
//                       <img src={image} alt={`Image ${index}`} style={{ width: '100%' }} />
//                     </div>
//                   ))}
//                 </Slider>
//               ) : (
//                 post.imageuploaded.map((image, index) => (
//                   <div className='imgbox'>
//                     <img key={index} src={image} alt={`Image ${index}`} style={{ width: '100%' }} />
//                   </div>
//                 ))
//               )}
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
