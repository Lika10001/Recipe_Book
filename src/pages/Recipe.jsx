import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import {useAuth} from "../context/AuthProvider";
import axios from "axios";

function Recipe() {
  const [details, setDetails] = useState({});
  const [activeTab, setActiveTab] = useState("instructions");
  const [isFavorite, setIsFavorite] = useState(false);  // Добавим состояние для отслеживания


  let params = useParams();
  const { user,favorites, addToFavorites } = useAuth();

  const handleAddToFavorites = async (recipe) => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    if (!recipe || !recipe._id) {
      console.error('Invalid recipe object');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/favorites/${params.id}`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      console.log(response.data.message);
      addToFavorites(recipe); // Добавление рецепта в контекст

      // Обновляем состояние, что рецепт добавлен в избранное
      setIsFavorite(true);
    } catch (error) {
      console.error('Error adding to favorites:', error.response?.data?.message || error.message);
    }
  };

  const fetchDetails = async () => {
    try {
      console.log('Fetching details for id:', params.id);
      const response = await fetch(`http://localhost:5000/recipes/${params.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const detailData = await response.json();
      console.log('Fetched recipe details:', detailData);
      setDetails(detailData);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  useEffect(() => {
    fetchDetails();

  }, [params.id]);

  useEffect(() => {
    if (user) {
      const isInFavorites = favorites.some(recipe => recipe._id === details._id);
      setIsFavorite(isInFavorites);
    }
  }, [user, details, favorites]);

  if (!details.title) {
    return <div>Loading...</div>;
  }

  return (
      <DetailWrapper>
        <LeftSection>
          <Header>
            <h2>{details.title}</h2>
          </Header>
          <Tabs>
            <Button
                className={activeTab === "instructions" ? "active" : ""}
                onClick={() => setActiveTab("instructions")}
            >
              <span role="img" aria-label="book">📖</span> Instructions
            </Button>
            <Button
                className={activeTab === "ingredients" ? "active" : ""}
                onClick={() => setActiveTab("ingredients")}
            >
              <span role="img" aria-label="carrot">🥕</span> Ingredients
            </Button>
            <Button onClick={() => handleAddToFavorites(details)}
                className={isFavorite ? "active" : ""}>
                <span role="img" aria-label="heart">
                  {isFavorite ? '❤️' : '🤍'} {/* Здесь меняется иконка */}
                </span>
                {isFavorite ? 'Added to Favorites' : 'Add to Favorites'} {/* Меняется текст */}
            </Button>

          </Tabs>
          <ImageWrapper>
            <img src={details.image} alt={details.title} />
          </ImageWrapper>
        </LeftSection>
        <Info>

          <ContentArea>
            {activeTab === "instructions" && (
                <div>
                  <h3><span role="img" aria-label="checklist">✅</span> Instructions</h3>
                  <p>{details.instructions}</p>
                </div>
            )}

            {activeTab === "ingredients" && (
                <div>
                  <h3><span role="img" aria-label="basket">🛒</span> Ingredients</h3>
                  <ul>
                    {details.ingredients &&
                        details.ingredients.map((ingredient, index) => (
                            <li key={index}>
                              <span role="img" aria-label="dot">🔸</span> {ingredient}
                            </li>
                        ))}
                  </ul>
                </div>
            )}
          </ContentArea>
        </Info>
      </DetailWrapper>
  );
}
const DetailWrapper = styled.div`
  margin: 2rem auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 3rem;
  max-width: 1200px;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 600px;

  img {
    width: 100%;
    height: auto;
    border-radius: 15px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    object-fit: cover;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;
const Button = styled.button`
  padding: 0.75rem 1.5rem;
  color: #313131;
  background: white;
  border: 2px solid black;
  font-weight: 600;
  cursor: pointer;
  border-radius: 30px;
  transition: background 0.3s, color 0.3s;

  &.active {
    background: #313131;
    color: white;
  }

  &:hover {
    background: #494949;
    color: white;
  }

  span {
    margin-right: 0.5rem;
  }
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  h2 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
`;
const ContentArea = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  margin-top: 100px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 500px;
  overflow-y: auto;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    color: #444;
    display: flex;
    align-items: center;
  }

  p {
    line-height: 1.6;
    font-size: 1rem;
    color: #555;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      padding: 0.5rem 0;
      font-size: 1rem;
      color: #333;
      display: flex;
      align-items: center;

      span {
        margin-right: 0.5rem;
      }
    }
  }
`;
// Add this function for the "Add to Favorites" button functionality
export default Recipe;
