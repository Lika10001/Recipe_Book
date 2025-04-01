import Category from "./components/Category";
import Pages from "./pages/Pages";
import { BrowserRouter } from 'react-router-dom';
import Search from "./components/Search";
import AuthButtons from "./components/AuthButtons";
import styled from "styled-components";
import { GiKnifeFork } from "react-icons/gi";
import { Link } from "react-router-dom";
import {AuthProvider} from "./context/AuthProvider";

function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <AuthProvider>
          <TopRow>
            <Nav>
              <GiKnifeFork />
              <Logo to={"/"}>Delicious Recipes</Logo>
            </Nav>

            <SearchWrapper>
              <Search />
            </SearchWrapper>

              <AuthButtons />

          </TopRow>

          <BottomRow>
            <Category />
          </BottomRow>
          <Divider />

          <Pages />
          </AuthProvider>
        </BrowserRouter>
      </div>
  );
}

const Logo = styled(Link)`
  text-decoration: none;
  font-size: 1.7rem;
  font-weight: 400;
  font-family: 'Lobster Two', cursive;
  width: 100%;
  align-self: center;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  svg {
    font-size: 2.5rem;
    margin-right: 10px;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px; 
  width: 100%;

  background: linear-gradient(135deg, #a2c2e6, #d3e8f3);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 10px;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
`;

const SearchWrapper = styled.div`
  flex-grow: 1;
  max-width: 400px;
`;

const Divider = styled.hr`
  width: 100%;
  border: 0;
  border-top: 2px solid #a2c2e6;
  opacity: 0.5; 
  margin-bottom: 10px;
`;

export default App;
