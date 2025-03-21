import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {

    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

    const handleTransaction = (e) => {
        e.preventDefault();
        const newTransaction = {
            amount: Number(amount), // Convert to number
            type,
            category,
            notes,
            member: name,
            date: new Date().toISOString(),
        };
        processTransaction(newTransaction);
        setAmount('');
        setType('expense');
        setCategory('');
        setNotes('');
        navigate('/transactions');
    }

    const processTransaction = (transaction) => {
        const existingTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const updatedTransactions = [...existingTransactions, { ...transaction, id: Date.now() }];
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    };

    return (
        <main className='container-fluid'>
            <div className="item">
                <h2>Your Monthly Spending</h2>
                <div id="picture">
                    <img src="/placeholder.jpg" alt="Pie chart" />
                </div>
            </div>
            <div className="item">
                <h2>Log a New Transaction</h2>
                <form onSubmit={handleTransaction}>
                    <select name="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}>
                        <option value="" disabled>
                            Select an option
                        </option>
                        <option>Expense</option>
                        <option>Income</option>
                    </select>
                    <select name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        <option value="" disabled>
                            Select an option
                        </option>
                        <option>Piano Lessons</option>
                        <option>Stipend</option>
                        <option>Reimbursement</option>
                        <option>Tithing</option>
                        <option>Car Repair</option>
                        <option>School</option>
                        <option>Groceries</option>
                        <option>Gifts</option>
                        <option>Gas</option>
                        <option>Wholesome Recreational Activities</option>
                        <option>Home</option>
                        <option>clothes</option>
                        <option>classifieds</option>
                        <option>Rent</option>
                        <option>Utilities</option>
                        <option>savings</option>
                    </select>
                    <input type="text"
                        name="amount"
                        placeholder="$ amount"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <input type="text"
                        name="comments"
                        placeholder="Comments"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <button type="submit"
                        className="button">
                        Submit
                    </button>
                </form>
            </div>

            <div className="item">
                <button  onClick={() => navigate('/transactions')}
                    className="button2">
                    Transaction History
                </button>
            </div>
        </main>
    );
}