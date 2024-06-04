import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useParams, useLocation } from "react-router-dom";
import { collection, addDoc, doc, getDoc, query, where, getDocs, deleteDoc, updateDoc, setDoc } from "firebase/firestore"; // Import Firestore methods

export default function FriendRequestsPage() {
    const [friendRequests, setFriendRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState(new Set());
    const { userId } = useParams();
    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                // const snapshot = await db.collection('friendRequests').where('receiverUid', '==', userId).get();
                // const requestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const q = query(collection(db, 'friendRequests'), where('receiverUid', '==', userId));
                // Execute the query
                const snapshot = await getDocs(q);

                console.log(snapshot);
                // Process the snapshot and return data
                const friendRequests = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFriendRequests(friendRequests);  
                console.log("friendrequests from notifications", friendRequests);
            } catch (error) {
                console.error("Error fetching friend requests:", error);
            }
        };

        fetchFriendRequests();
    }, [userId]);

    const acceptRequest = async (requestId, senderId) => {
        try {
            if (acceptedRequests.has(requestId)) {
                console.log("Request already accepted.");
                return;
            }
            // Get sender's document reference
            // const senderDocRef = collection(db, 'friends').doc(senderId);
            const senderDocRef = doc(db, 'friends', senderId);
            // Update sender's 'friends' document
            await updateFriends(senderDocRef, userId);

            // Get receiver's document reference
            // const receiverDocRef = collection(db, 'friends').doc(userId);
            const receiverDocRef = doc(db, 'friends', userId);
            // Update receiver's 'friends' document
            await updateFriends(receiverDocRef, senderId);
            
            // Delete the friend request document
            console.log("Deleting friend request with ID:", requestId);
            if (requestId) {
                // await deleteDoc(collection(db,'friendRequests'), requestId);
                await deleteDoc(doc(db, "friendRequests",requestId));
            } else {
                console.error("requestId is undefined");
            }
            // Mark request as accepted
            setAcceptedRequests(prevState => new Set(prevState.add(requestId)));
            // await db.collection('friendRequests').doc(requestId).delete();
            console.log("Friend request deleted successfully!");
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    // Function to update 'friends' document for a user
    const updateFriends = async (userDocRef, friendId) => {
        try {
            // Check if the document exists
            const docSnapshot = await getDoc(userDocRef);
            
            if (!docSnapshot.exists()) {
                // If document doesn't exist, create it with the given friendId
                await setDoc(userDocRef, {
                    userId: userDocRef.id,
                    friends: [friendId]
                });
            } else {
                // If document exists, update the 'friends' array
                const friendsData = docSnapshot.data();
                const updatedFriends = [...friendsData.friends, friendId];
                await updateDoc(userDocRef, { friends: updatedFriends });
            }
        } catch (error) {
            console.error("Error updating friends:", error);
        }
    };
    
    
        return (
        <div>
            <h1>Friend Requests</h1>
            <ul>
                {friendRequests.map(request => (
                    <li key={request.id}>
                        Sender: {request.senderUid}
                        <button onClick={() => acceptRequest(request.id, request.senderUid)}>Accept</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Function to accept a friend request
        // const acceptRequest = async (requestId, senderId) => {
        //     try {
        //         // Update sender's 'friends' document
        //         await updateFriends(senderId, userId);
        
        //         // Update receiver's 'friends' document
        //         await updateFriends(userId, senderId);
        
        //         // Delete the friend request document
        //         await db.collection('friendRequests').doc(requestId).delete();
        //     } catch (error) {
        //         console.error("Error accepting friend request:", error);
        //     }
        // };
    
        // // Function to update 'friends' document for a user
        // const updateFriends = async (userId, friendId) => {
        //     try {
        //         // Check if 'friends' document exists for the user
        //         const friendsDoc = await db.collection('friends').doc(userId).get();
        //         if (!friendsDoc.exists) {
            //             // If 'friends' document doesn't exist, create it
        //             await db.collection('friends').doc(userId).set({
        //                 userId: userId,
        //                 friends: [friendId]
        //             });
        //         } else {
        //             // If 'friends' document exists, update the 'friends' array
        //             await db.collection('friends').doc(userId).update({
        //                 friends: db.firestore.FieldValue.arrayUnion(friendId)
        //             });
        //         }
        //     } catch (error) {
            //         console.error("Error updating friends:", error);
            //     }
            // };
            // Function to accept a friend request
            // const acceptRequest = async (requestId, senderId) => {
                //     try {
                    //         // Get sender's document reference
        //         const senderDocRef = collection(db, 'friends', senderId);
    
        //         // Update sender's 'friends' document
        //         await updateFriends(senderDocRef, userId);
        
        //         // Get receiver's document reference
        //         const receiverDocRef = collection(db, 'friends', userId);
        
        //         // Update receiver's 'friends' document
        //         await updateFriends(receiverDocRef, senderId);
        
        //         // Delete the friend request document
        //         await deleteDoc(collection(db, 'friendRequests'), requestId);
        //     } catch (error) {
        //         console.error("Error accepting friend request:", error);
        //     }
        // };
        
        // // Function to update 'friends' document for a user
        // const updateFriends = async (userCollectionRef, friendId) => {
        //     try {
        //         // Get the current snapshot of the 'friends' document
        //         const friendsSnapshot = await getDoc(userCollectionRef);
    
        //         if (!friendsSnapshot.exists()) {
        //             // If 'friends' document doesn't exist, create it
        //             await setDoc(userCollectionRef, {
        //                 userId: userCollectionRef.id,
        //                 friends: [friendId]
        //             });
        //         } else {
            //             // If 'friends' document exists, update the 'friends' array
        //             const friendsData = friendsSnapshot.data();
        //             const updatedFriends = [...friendsData.friends, friendId];
        //             await updateDoc(userCollectionRef, { friends: updatedFriends });
        //         }
        //     } catch (error) {
        //         console.error("Error updating friends:", error);
        //     }
        // };
        //Function to accept a friend request
        // const acceptRequest = async (requestId, senderId, receiverId) => {
            //     try {
        //         // Get sender's document reference
        //         const senderDocRef = doc(db, 'friends', senderId);
        //         // Update sender's 'friends' document
        //         await updateFriends(senderDocRef, receiverId);
        
        //         // Get receiver's document reference
        //         const receiverDocRef = doc(db, 'friends', receiverId);
        //         // Update receiver's 'friends' document
        //         await updateFriends(receiverDocRef, senderId);
        
        //         // Delete the friend request document
        //         await deleteDoc(collection(db, 'friendRequests'), requestId);
        //     } catch (error) {
            //         console.error("Error accepting friend request:", error);
            //     }
            // };
            
            // // Function to update 'friends' document for a user
            // const updateFriends = async (userDocRef, friendId) => {
                //     try {
                    //         // Check if the document exists
                    //         const docSnapshot = await getDoc(userDocRef);
                    
                    //         let updatedFriends = [];
                    
                    //         if (docSnapshot.exists()) {
                        //             const friendsData = docSnapshot.data();
        //             updatedFriends = friendsData.friends || [];
        //         }
        
        //         // Ensure friendId is not already in the friends list
        //         if (!updatedFriends.includes(friendId)) {
        //             updatedFriends.push(friendId);
        //         }
        
        //         // Update the 'friends' array
        //         await setDoc(userDocRef, { friends: updatedFriends });
        //     } catch (error) {
            //         console.error("Error updating friends:", error);
            //     }
            // };
            