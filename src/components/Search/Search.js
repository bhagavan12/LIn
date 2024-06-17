// import React, { useState } from "react";
// import { Form } from "react-bootstrap"; // Import Form component from react-bootstrap
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../../firebase";

// const Search = () => {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [searchResults, setSearchResults] = useState([]);

//     const handleSearchChange = async (e) => {
//         const queryValue = e.target.value.trim(); // Remove leading/trailing whitespace
//         setSearchQuery(queryValue);

//         try {
//             const q = query(collection(db, "users"), where("username", ">=", queryValue));
//             const querySnapshot = await getDocs(q);
//             const users = [];
//             querySnapshot.forEach((doc) => {
//                 users.push(doc.data().username);
//             });
//             setSearchResults(users);
//             console.log(searchResults);
//         } catch (error) {
//             console.error("Error searching users:", error);
//             setSearchResults([]);
//         }
//     };
 
//     return (
//         <div className="mt-3">
//             <Form.Group controlId="searchForm">
//                 <Form.Control
//                     type="text"
//                     placeholder="Search users by username"
//                     value={searchQuery}
//                     onChange={handleSearchChange}
//                 />
//             </Form.Group>
//             {searchResults.length > 0 && (
//                 <ul>
//                     {searchResults.map((username) => (
//                         <div key={username}>{username}</div>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default Search;
import React, { useState } from "react";
import './search.css';
import { Form } from "react-bootstrap";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { useUserAuth } from "../../context/UserAuthContext"; 
const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate
    const { userDataf } = useUserAuth();
    const handleSearchChange = async (e) => {
        const queryValue = e.target.value.trim();
        setSearchQuery(queryValue);

        try {
            const q = query(collection(db, "users"), where("username", ">=", queryValue));
            const querySnapshot = await getDocs(q);
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            setSearchResults(users);
            console.log(searchResults);
        } catch (error) {
            console.error("Error searching users:", error);
            setSearchResults([]);
        }
    };

    const handleUserClick = async (user) => {
        const { uid } = await userDataf(); // Get the logged-in user's UID
        if (uid === user.uid){
            navigate("/mdb"); // Navigate to /mdb if the logged-in user's UID matches the clicked user's UID
        } else {
            console.log("userrr",user);
            navigate(`/userprofile/${user.uid}`, { state: { userData: user } });
        }
        // navigate(`/userprofile/${user.uid}`, { state: { userData: user } }); // Navigate to user profile page with user data
    };

    return (
        // <div className="mt-3">
        //     <Form.Group controlId="searchForm">
        //         <Form.Control
        //             type="text"
        //             placeholder="Search users by username"
        //             value={searchQuery}
        //             onChange={handleSearchChange}
        //         />
        //     </Form.Group>
        //     {searchResults.length > 0 && (
        //         <ul>
        //             {searchResults.map((user) => (
        //                 <li key={user.uid} onClick={() => handleUserClick(user)}>
        //                     {user.username}
        //                 </li>
        //             ))}
        //         </ul>
        //     )}
        // </div>
        <div className="mt-3">
            <label htmlFor="usernameField" className="usernamelabel label">Username</label>
            <input
                type="text"
                placeholder="@"
                id="usernameField"
                required="required"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            {searchResults.length > 0 && (
                <ul>
                    {searchResults.map((user) => (
                        <li key={user.uid} onClick={() => handleUserClick(user)}>
                            {user.username}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;
