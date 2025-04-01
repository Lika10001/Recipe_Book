import React from 'react';
import { useAuth } from '../context/AuthProvider';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';

const AuthButtons = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile'); // Переход на страницу профиля
    };

    const handleLogout = () => {
        logout();  // Выполняем логаут
        navigate('/');  // Перенаправляем на главную страницу
    };


    return (
        <Wrapper>
            {user ? (
                <UserMenu>
                    <UserIcon>
                        <FaUserCircle size={30}  onClick={handleProfileClick} />
                        <UserName>{user.username}</UserName>
                    </UserIcon>
                    <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                </UserMenu>
            ) : (
                <ButtonGroup>
                    <LoginButton to="/login">Login</LoginButton>
                    <RegisterButton to="/register">Register</RegisterButton>
                </ButtonGroup>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
`;

// Используем Link вместо a
const LoginButton = styled(Link)`
    text-decoration: none;
    padding: 0.5rem 1rem;
    background: #5492e1;
    color: white;
    border-radius: 5px;
    transition: background 0.3s;

    &:hover {
        background: #a2c2e6;
    }
`;

const RegisterButton = styled(LoginButton)``;

const UserMenu = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const UserIcon = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #333;
`;

const UserName = styled.span`
    font-size: 1rem;
    font-weight: 600;
`;

const LogoutButton = styled.button`
    padding: 0.5rem 1rem;
    background: #e35454;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background: #ff7777;
    }
`;

export default AuthButtons;
