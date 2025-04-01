import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [favorites, setFavorites] = useState([]);


    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setFavorites([]);
        localStorage.removeItem('user');
    };

    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const addToFavorites = async (recipe) => {
        if (isLoading) return;  // Если запрос уже выполняется, то не отправляем новый
        setIsLoading(true);
        if (!user) {
            console.error('User is not authenticated');
            return;
        }

        if (!recipe || !recipe._id) {
            console.error('Invalid recipe object');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/favorites/${recipe._id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${user.token}` },
            });

            if (!response.ok) {
                throw new Error('Failed to add to favorites');
            }

            const data = await response.json();
            console.log('Recipe added:', data);

            setFavorites((prev) => [...prev, recipe]);
        } catch (err) {
            console.error('Error:', err.message);
        } finally {
            setIsLoading(false);  // Разблокируем кнопку после завершения запроса

        }
    };

    const fetchFavorites = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/favorites', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setFavorites(response.data); // Обновляем список избранных рецептов
        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    };

    const removeFromFavorites = (recipeId) => {
        setFavorites(favorites.filter(recipe => recipe._id !== recipeId)); // Удаляем рецепт из локального списка
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, favorites, addToFavorites, removeFromFavorites, setFavorites, setUser}}>
            {children}
        </AuthContext.Provider>
    );
};
