// import React from "react";
// import { useUserAuth } from "../context/UserAuthContext";

// const Profile = () => {
//     const { userDataf } = useUserAuth();
//     console.log(userDataf);
//     return (
//         <div className="p-4 box">
//             <h2 className="mb-3">User Profile</h2>
//             {userDataf && (
//                 <div>
//                     <p><strong>Email:</strong> {userDataf.email}</p>
//                     <p><strong>Full Name:</strong> {userDataf.fullName}</p>
//                     <p><strong>Username:</strong> {userDataf.username}</p>
//                     <p><strong>Date of Birth:</strong> {userDataf.dob}</p>
//                     <p><strong>Gender:</strong> {userDataf.gender}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Profile;
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";

const Profile = () => {
  const { userDataf } = useUserAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchData = async () => {
      const data = await userDataf();
      setUserData(data);
    };
    fetchData();
  }, [userDataf]);

  console.log(userData); 

  return (
    <div className="p-4 box">
      <h2 className="mb-3">User Profile</h2>
      {userData && (
        <div>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Full Name:</strong> {userData.fullName}</p>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Date of Birth:</strong> {userData.dob}</p>
          <p><strong>Gender:</strong> {userData.gender}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
