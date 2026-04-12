// Updated UserCard.jsx for dark mode UI with gradient overlays and improved button styling
import React from 'react';
import './UserCard.css';

const UserCard = ({ user }) => {
    return (
        <div className="user-card dark-mode">
            <div className="user-info">
                <h2>{user.name}</h2>
                <p>{user.bio}</p>
            </div>
            <button className="btn styled-btn">Connect</button>
        </div>
    );
};

export default UserCard;