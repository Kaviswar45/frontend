import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {jwtDecode} from 'jwt-decode'; // Correct import

// Styled components
const Container = styled.div`
    display: flex;
    height: 100vh;
    background: linear-gradient(to right, #00c6ff, #0072ff);
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
`;

const Sidebar = styled.div`
    width: 250px;
    background: rgba(255, 255, 255, 0.9);
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const SidebarTop = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px; // Adds space between buttons
`;

const SidebarBottom = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px; // Adds space between buttons
`;

const MainContent = styled.div`
    flex: 1;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 300px;
`;

const Input = styled.input`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    width: 100%; // Ensures buttons have consistent width

    &:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
    }
`;

// Helper function to get the current date in YYYY-MM-DD format
const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Expense = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [expenseDate, setExpenseDate] = useState(getCurrentDate()); // Set default to current date
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Error message state
    const navigate = useNavigate();
    const todayDate = getCurrentDate(); // Get today's date for input limits

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.username);
        } catch (error) {
            console.error('Failed to decode token:', error);
            navigate('/login');
        }
    }, [navigate]);

    const handleAddExpense = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    description,
                    expense_date: expenseDate,
                }),
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                const result = await response.json();
                setErrorMessage(result.error || 'Failed to add expense');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An unexpected error occurred');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Container>
            <Sidebar>
                <SidebarTop>
                    <h2>Hi, {username}</h2>
                    <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
                    <Button onClick={() => navigate('/income')}>Income</Button>
                    <Button onClick={() => navigate('/expenses')}>Expenses</Button>
                </SidebarTop>
                <SidebarBottom>
                    <Button onClick={handleLogout}>Logout</Button>
                </SidebarBottom>
            </Sidebar>
            <MainContent>
                <h2>Add Expense</h2>
                <Form>
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <Input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Input
                        type="date"
                        placeholder="Expense Date"
                        value={expenseDate}
                        min={todayDate}
                        max={todayDate}
                        onChange={(e) => setExpenseDate(e.target.value)}
                    />
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Error message */}
                    <Button onClick={handleAddExpense}>Add Expense</Button>
                </Form>
            </MainContent>
        </Container>
    );
};

export default Expense;