import React from 'react';
import axios from 'axios';

const RecipeCard = ({ recipe }) => {
    const handleSaveToFavorites = async () => {
        try {
            const token = localStorage.getItem('token'); // Получаем токен из localStorage
            await axios.post(
                'http://localhost:5000/save-recipe',
                { recipeId: recipe._id },
                { headers: { Authorization: token } }
            );
            alert('Recipe saved to favorites!');
        } catch (err) {
            console.error(err);
            alert('Failed to save recipe. Please log in.');
        }
    };

    return (
        <div>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <button onClick={handleSaveToFavorites}>Save to Favorites</button>
        </div>
    );
};

export default RecipeCard;
