import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function Searched() {
    const [searchedRecipes, setSearchedRecipes] = useState([]);
    let params = useParams();  // Получаем параметр поиска из URL

    const getSearched = async (name) => {
       // const check = localStorage.getItem(`recipe${name}`);
        //if (check) {
          //  setSearchedRecipes(JSON.parse(check));
        //} else {
            const data = await fetch(`http://localhost:5000/recipes_search?query=${name}`); // Запрос на правильный маршрут
            const recipes = await data.json();

            if (recipes.results) {
                localStorage.setItem(`recipe${name}`, JSON.stringify(recipes.results));
                setSearchedRecipes(recipes.results);
            } else {
                console.error("Error: No results found");
            }
        //}
    };


    useEffect(() => {
        getSearched(params.search);  // Используем search из URL для запроса
    }, [params.search]);

    return (
        <Grid>
            {Array.isArray(searchedRecipes) && searchedRecipes.length > 0 ? (
                searchedRecipes.map((item) => {
                    return (
                        <Card key={item._id}>
                            <Link to={`/recipe/${item._id}`}>
                                <img src={item.image} alt="" />
                                <h4>{item.title}</h4>
                            </Link>
                        </Card>
                    );
                })
            ) : (
                <p>No recipes found</p>  // Сообщение если нет результатов
            )}
        </Grid>
    );
}

const Grid = styled.div`
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

export default Searched;
