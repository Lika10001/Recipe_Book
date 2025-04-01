import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { Link } from 'react-router-dom';

function Veggie() {
    const [veggie, setVeggie] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getRecipes = async () => {
            try {
                const response = await fetch('http://localhost:5000/recipes');
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке рецептов');
                }
                const data = await response.json();
                setVeggie(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        getRecipes();
    }, []);

    if (loading) return <LoadingMessage>Загрузка...</LoadingMessage>;
    if (error) return <ErrorMessage>Ошибка: {error}</ErrorMessage>;

    return (
        <Wrapper>
            <Title>Recommended Picks</Title>
            <Splide options={{
                perPage: 3,
                arrows: false,
                pagination: false,
                drag: 'free',
                gap: '2rem',
            }}>
                {veggie && Array.isArray(veggie) && veggie.map((recipe) => (
                    <SplideSlide key={recipe._id}>
                        <Card>
                            <Link to={'/recipe/' + recipe._id}>

                                    <img src={recipe.image} alt={recipe.title} />
                                    <GradientOverlay />

                                <CardTitle>{recipe.title}</CardTitle>
                            </Link>
                        </Card>
                    </SplideSlide>
                ))}
            </Splide>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin: 3rem 0;
    text-align: center;
`;

const Title = styled.h3`
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: #333;
`;

const LoadingMessage = styled.div`
    font-size: 1.5rem;
    color: #999;
    text-align: center;
    padding: 2rem;
`;

const ErrorMessage = styled.div`
    font-size: 1.5rem;
    color: #e74c3c;
    text-align: center;
    padding: 2rem;
`;


const Card = styled.div`
min-height: 25rem;
border-radius: 2rem;
overflow: hidden;
position: relative;

img {
    border-radius: 2rem;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
    
    &:hover {
        box-shadow: 0 12px 24px #a2c2e6;

    }

    a {
        text-decoration: none;
    }
`;

const ImageWrapper = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    border-radius: 1.5rem;
    /* Убираем эффект масштабирования для картинок, оставляем плавный эффект */
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;  /* Сохраняем пропорции картинки, заполняя контейнер */
        transition: transform 0.3s ease-in-out;
    }

    &:hover img {
        transform: scale(1.05); /* Увеличиваем картинку при наведении */
    }
`;

const GradientOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
    z-index: 1;
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
    padding: 0 1rem;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
    text-align: center;
`;

export default Veggie;
