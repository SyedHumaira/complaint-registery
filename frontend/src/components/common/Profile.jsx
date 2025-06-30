// File: frontend/src/components/common/Profile.jsx
import React from "react";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <p>Not logged in</p>;

  return (
    <>
      <div className="container my-5">
        <h3>Your Profile</h3>
        <ul className="list-group">
          <li className="list-group-item"><strong>Name:</strong> {user.name}</li>
          <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
          <li className="list-group-item"><strong>Phone:</strong> {user.phone}</li>
          <li className="list-group-item"><strong>User Type:</strong> {user.userType}</li>
        </ul>
      </div>
    </>
  );
};

export default Profile;
