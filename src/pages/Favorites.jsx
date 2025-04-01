import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/favorites', { withCredentials: true });
                setFavorites(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFavorites();
    }, []);

    return (
        <div>
            <h2>Favorite Recipes</h2>
            {favorites.map((recipe) => (
                <div key={recipe._id}>
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description}</p>
                </div>
            ))}
        </div>
    );
};

export default Favorites;
