import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider'; // Подключаем контекст
import styled from 'styled-components';
import axios from 'axios';
import FavoriteRecipes from "../components/FavoriteRecipes"; // Компонент для избранных рецептов
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate

const UserProfile = () => {
    const { user, logout, setUser } = useAuth(); // Получаем пользователя и функцию logout из контекста
    const [isEditing, setIsEditing] = useState(false); // Состояние редактирования
    const [editedUser, setEditedUser] = useState({
        username: user?.username || '',
        email: user?.email || '',
    });
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const [error, setError] = useState(null); // Ошибка при редактировании

    const navigate = useNavigate();

    // Включаем режим редактирования
    const handleEdit = () => setIsEditing(true);

    // Сохраняем изменения
    const handleSave = async () => {
        if (!editedUser.username || !editedUser.email) {
            setError('Username and Email are required.');
            return;
        }
        setError(null);

        try {
            setIsLoading(true); // Показываем индикатор загрузки

            // Отправляем данные на сервер для обновления
            const updatedData = {
                username: editedUser.username,
                email: editedUser.email,
            };

            const response = await axios.put('http://localhost:5000/users/update', updatedData, {
                headers: {
                    Authorization: `Bearer ${user.token}`, // Используем токен для авторизации
                },
            });

            setUser(response.data); // Обновляем данные пользователя
            setIsEditing(false); // Выключаем режим редактирования
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Error updating profile. Please try again.');
        } finally {
            setIsLoading(false); // Скрываем индикатор загрузки
        }
    };

    const handleLogout = () => {
        logout();  // Выполняем логаут
        navigate('/');  // Перенаправляем на главную страницу
    };

    // Используем useEffect для корректного обновления данных при изменении user
    useEffect(() => {
        if (user) {
            setEditedUser({
                username: user.username,
                email: user.email,
            });
        }
    }, [user]);

    if (!user) {
        return <p>Loading...</p>; // Пока данные пользователя не загружены, показываем "Loading..."
    }

    return (
        <ProfileContainer>
            <Card>
                <h2>User Profile</h2>
                {isEditing ? (
                    <>
                        <Input
                            type="text"
                            value={editedUser.username}
                            onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                            placeholder="Username"
                        />
                        <Input
                            type="email"
                            value={editedUser.email}
                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                            placeholder="Email"
                        />
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                        <Button onClick={() => setIsEditing(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <Button onClick={handleEdit}>Edit Profile</Button>
                    </>
                )}
                <Button onClick={handleLogout}>Logout</Button>
            </Card>
            <FavoriteRecipes />
        </ProfileContainer>
    );
};

const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;
`;

const Card = styled.div`
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 300px;
    text-align: center;
`;

const Input = styled.input`
    display: block;
    width: 100%;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    background-color: #6c63ff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #574ee1;
    }
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 1rem;
    margin-top: 1rem;
`;

export default UserProfile;
