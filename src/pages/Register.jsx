import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {useAuth} from "../context/AuthProvider";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/register', {
                username,
                email,
                password,
            });
            const userData = { username: res.data.username, token: res.data.token };
            login(userData);
            console.log(res.data.message);
            navigate('/'); // Redirect to login page
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Wrapper>
            <FormContainer>
                <h2>Register</h2>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <form onSubmit={handleSubmit}>
                    <Label>
                        Username
                        <Input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Label>
                    <Label>
                        Email
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Label>
                    <Label>
                        Password
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Label>
                    <Button type="submit">Register</Button>
                </form>
            </FormContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    background: #ffffff;
`;

const FormContainer = styled.div`
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 400px;
`;

const Label = styled.label`
    display: block;
    text-align: left;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #333;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;

    &:focus {
        border-color: #a2c2e6;
        outline: none;
        box-shadow: 0 0 5px #a2c2e6;
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 0.75rem;
    background: #5492e1;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background: #a2c2e6;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    margin-bottom: 1rem;
`;

export default Register;
