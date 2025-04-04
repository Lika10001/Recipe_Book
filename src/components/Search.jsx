import styled from "styled-components";
import { useState } from "react";
import {FaSearch} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Search() {

    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        navigate('/searched/' + input);
    };


  return (
    <FormStyle onSubmit={submitHandler}>
        <div>
         <FaSearch></FaSearch>
        <input onChange={(e) => setInput(e.target.value)} type="text" value={input} />
        
        </div>
    </FormStyle>
  )
}

const FormStyle = styled.form`
    width: 100%;  /* Расширяет форму на всю доступную ширину */
    max-width: 800px; /* Максимальная ширина компонента */

    div {
        width: 100%;
        position: relative;
    }

    input {
        border: none;
        background: linear-gradient(35deg, #494949, #313131);
        font-size: 1rem;
        color: white;
        padding: 1rem 3rem;
        border-radius: 1rem;
        outline: none;
        width: 100%;  /* Поле ввода будет занимать всю доступную ширину */
    }

    svg {
        position: absolute;
        top: 50%;
        left: 0%;
        transform: translate(100%, -50%);
        color: white;
    }
`;

export default Search