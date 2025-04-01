import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import axios from "axios";

function Cuisine() {
    const [cuisine, setCuisine] = useState([]);  // Стейт для хранения данных о кухне
    const params = useParams();  // Получаем параметры из URL

    // Функция для получения рецептов по типу кухни
    const getCuisine = async () => {
        try {
            // Запрос на сервер для получения рецептов по типу кухни
            const response = await axios.get(`http://localhost:5000/recipes_cuisine/${params.type}`);

            // Если данные есть, сохраняем их в localStorage и в стейт
            if (response.data && response.data.results) {
                localStorage.setItem(`cuisine${params.type}`, JSON.stringify(response.data.results));
                setCuisine(response.data.results);
            } else {
                console.error("No results found for cuisine:", params.type);
            }
        } catch (error) {
            console.error("Error fetching cuisine:", error);
        }
    };

    // useEffect вызывается при изменении параметра 'type' в URL
    useEffect(() => {
        getCuisine();
    }, [params.type]);

    return (
        <Grid
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Отображаем рецепты на странице */}
            {cuisine.map((item) => {
                console.log(item);  // Добавляем лог, чтобы проверить структуру данных
                return (
                    <Card key={item._id}> {/* Если в данных есть _id, используйте его */}
                        <a href={`/recipe/${item._id}`}> {/* Если в данных есть _id, используйте его */}
                            <img src={item.image} alt={item.title} />
                            <h4>{item.title}</h4>
                        </a>
                    </Card>
                );
            })}
        </Grid>
    );
}

// Стили для отображения рецептов в сетке
const Grid = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    grid-gap: 3rem;
`;

const Card = styled.div`
    img {
        width: 100%;
        border-radius: 2rem;
    }
    a {
        text-decoration: none;
    }
    h4 {
        text-align: center;
        padding: 1rem;
    }
`;

export default Cuisine;
