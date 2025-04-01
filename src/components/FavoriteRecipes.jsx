import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";

const FavoriteRecipes = () => {
    const { user, favorites, removeFromFavorites, setFavorites } = useAuth();  // Извлекаем функции из контекста
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await axios.get('http://localhost:5000/users/favorites', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setFavorites(res.data);
                console.log('Favorites:', res.data);
            } catch (err) {
                console.error('Error fetching favorites:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchFavorites();
        }
    }, [user, setFavorites]);  // добавляем setFavorites в зависимости

    const handleRemoveFavorite = async (recipeId) => {
        try {
            // Отправляем запрос на сервер для удаления рецепта из избранного
            const response = await axios.delete(`http://localhost:5000/favorites/${recipeId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200) {
                removeFromFavorites(recipeId);
            } else {
                console.error('Failed to remove favorite:', response.data.message);
            }
        } catch (err) {
            console.error('Error removing favorite:', err.message);
        }
    };

    if (loading) return <LoadingMessage>Loading favorites...</LoadingMessage>;

    return (
        <Wrapper>
            <Title>Your Favorite Recipes</Title>
            <Splide options={{
                perPage: 3,
                arrows: false,
                pagination: false,
                drag: "free",
                gap: "2rem",
            }}>
                {favorites.map((recipe) => (
                    <SplideSlide key={recipe._id}>
                        <Card>
                            <Link to={`/recipe/${recipe._id}`}>
                                <CardImage
                                     src={recipe.image} alt={recipe.title} />

                                <GradientOverlay />
                                <CardTitle>{recipe.title}</CardTitle>
                            </Link>
                            <RemoveButton onClick={() => handleRemoveFavorite(recipe._id)}>
                                Remove
                            </RemoveButton>
                        </Card>
                    </SplideSlide>
                ))}
            </Splide>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 2rem 0;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    gap: 2rem; 
    justify-content: center; 
`;


const Title = styled.h3`
    font-size: 2rem;
    margin-bottom: 2rem;
`;

const Card = styled.div`
    width: 100%;  /* Убедитесь, что карточка заполняет доступную ширину */
    height: 100%;  /* Убедитесь, что карточка заполняет доступную высоту */
    position: relative;
    border-radius: 2rem;
    overflow: hidden;  /* Обрезаем все, что выходит за границы карточки */

    display: flex;
    justify-content: center;  /* Центрируем содержимое карточки */
    align-items: center;  /* Центрируем содержимое карточки */
`;

const CardImage = styled.img`
    width: 100%;  /* Картинка будет растягиваться по ширине карточки */
    height: 100%;  /* Картинка будет растягиваться по высоте карточки */
    object-fit: cover;  /* Заполняем контейнер с сохранением пропорций */
`;

const RemoveButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #e74c3c;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    cursor: pointer;

    &:hover {
        background-color: #c0392b;
    }
`;

const CardTitle = styled.p`
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    z-index: 2;
`;




const GradientOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
`;


const LoadingMessage = styled.div`
    font-size: 1.5rem;
    color: #999;
    text-align: center;
    padding: 2rem;
`;

export default FavoriteRecipes;
