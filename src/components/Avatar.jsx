import React from 'react';
import styled from 'styled-components';

const AvatarComp = ({ avatar, onAvatarChange }) => {
    return (
        <AvatarContainer>
            {avatar ? (
                <img src={avatar} alt="Avatar" />
                ) : (
                <span>No Avatar</span>
                )}
            <Input
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
            />
        </AvatarContainer>
    );
};

const AvatarContainer = styled.div`
    margin-bottom: 1rem;
    text-align: center;
    position: relative;

    img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
    }

    span {
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
    }
`;

const Input = styled.input`
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 0.2rem;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }
`;

export default AvatarComp;
