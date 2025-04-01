import { useEffect, useState } from "react";
import styled from "styled-components";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { Link } from "react-router-dom";

function Popular() {
    const [popular, setPopular] = useState([]);  // Состояние для популярных рецептов
    const [loading, setLoading] = useState(true); // Состояние для загрузки
    const [error, setError] = useState(null); // Состояние для ошибок

    useEffect(() => {
        getPopular();
    }, []);  // Эффект срабатывает только при первом рендере компонента

    const getPopular = async () => {
        try {
            const check = localStorage.getItem('popular');  // Проверка данных в localStorage

            if (check) {
                const parsedData = JSON.parse(check);  // Если данные есть, парсим их
                setPopular(parsedData);
                setLoading(false);  // Устанавливаем состояние загрузки в false
            } else {
                console.log("Запрос на сервер...");
                const params = new URLSearchParams({
                    number: 3,  // Количество случайных рецептов
                }).toString();

                // Формируем правильный URL с параметрами
                const apiUrl = `http://localhost:5000/random_recipes?${params}`;

                // Отправляем GET-запрос
                const api = await fetch(apiUrl);

                if (!api.ok) {  // Проверяем, был ли успешным запрос
                    const errorMessage = `Ошибка при загрузке данных: ${api.status} ${api.statusText}`;
                    console.error(errorMessage);
                    throw new Error(errorMessage);
                }

                const data = await api.json();  // Получаем данные от API
                console.log("Полученные данные:", data);

                if (data.recipes) {
                    localStorage.setItem('popular', JSON.stringify(data.recipes));  // Сохраняем данные в localStorage
                    setPopular(data.recipes);  // Обновляем состояние с полученными рецептами
                } else {
                    setError("Нет данных о рецептах.");  // Если данных нет, выводим ошибку
                }

                setLoading(false);  // Устанавливаем состояние загрузки в false
            }
        } catch (err) {
            console.error("Ошибка при загрузке:", err);
            setError(err.message);  // Устанавливаем ошибку в состояние
            setLoading(false);  // Устанавливаем состояние загрузки в false
        }
    };

    // Отображение при загрузке
    if (loading) {
        return <div>Загрузка...</div>;
    }

    // Отображение при ошибке
    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <div>
            <Wrapper>
                <Title>Recipes of the day</Title>

                <Splide options={{
                    perPage: 3,  // Показываем только 3 слайда
                    arrows: false,
                    pagination: false,
                    drag: 'free',
                    gap: '5rem',
                }}>
                    {/* Проверка, чтобы избежать ошибки при пустом или невалидном массиве */}
                    {Array.isArray(popular) && popular.length > 0 ? (
                        popular.map((recipe) => (
                            <SplideSlide key={recipe._id}>  {/* Используйте _id вместо id */}
                                <Card>
                                    <Link to={'/recipe/' + recipe._id}> {/* Используем _id для формирования правильного URL */}
                                        <img src={recipe.image} alt={recipe.title} />
                                        <CardTitle>{recipe.title}</CardTitle>
                                        <Gradient />
                                    </Link>
                                </Card>
                            </SplideSlide>

                        ))
                    ) : (
                        <p>Нет популярных рецептов для отображения</p>  // Если нет данных
                    )}
                </Splide>
            </Wrapper>
        </div>
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

    p {
        position: absolute;
        z-index: 10;
        left: 50%;
        bottom: 0%;
        transform: translate(-50%, 0%);
        color: white;
        width: 100%;
        text-align: center;
        font-weight: 600;
        font-size: 1rem;
        height: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const Gradient = styled.div`
    z-index: 3;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
`;

export default Popular;
