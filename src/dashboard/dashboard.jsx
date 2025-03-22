import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {

    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [aiSummary, setAiSummary] = useState("Loading AI insights...");
    const navigate = useNavigate();

    useEffect(() => {
        generateAiSummary();
    }, []);

    const handleTransaction = (e) => {
        e.preventDefault();
        const newTransaction = {
            amount: Number(amount), 
            type,
            category,
            notes,
            member: localStorage.getItem('userName'),
            date: new Date().toISOString(),
        };
        processTransaction(newTransaction);
        setAmount('');
        setType('Expense');
        setCategory('');
        setNotes('');
        navigate('/transactions');
    }

    const processTransaction = (transaction) => {
        const existingTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const updatedTransactions = [...existingTransactions, { ...transaction, id: Date.now() }];
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    };

    const summarizeSpending = (transactions) => {
        let totalIncome = 0;
        let totalExpenses = 0;
        const categoryBreakdown = {};
      
        transactions.forEach((transaction) => {
          if (transaction.type === "Income") {
            totalIncome += transaction.amount;
          } else if (transaction.type === "Expense") {
            totalExpenses += transaction.amount;
          }
      
          if (!categoryBreakdown[transaction.category]) {
            categoryBreakdown[transaction.category] = 0;
          }
          categoryBreakdown[transaction.category] += transaction.amount;
        });
      
        const summary = `
          Total Income: $${totalIncome.toFixed(2)}
          Total Expenses: $${totalExpenses.toFixed(2)}
          Net Balance: $${(totalIncome - totalExpenses).toFixed(2)}
          Category Breakdown:
          ${Object.entries(categoryBreakdown)
            .map(([category, amount]) => `${category}: $${amount.toFixed(2)}`)
            .join("\n")}
        `;
      
        return summary;
      };

    async function generateAiSummary() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        if (transactions.length === 0) {
            setAiSummary("No transactions recorded yet. Start logging to get AI insights!");
            return;
        }

        const spendingSummary = summarizeSpending(transactions);

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {

                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "system", content: "You are a financial assistant providing budget insights for a young family trying to build their savings and spend responsibly. children are very important to them" },
                    { role: "user", content: `Analyze my weekly expenses and provide a terse financial summary. compare spending and income over time, where the money goes, and where we could have saved.:\n${spendingSummary}` }]
                })
            });

            const data = await response.json();
            const aiMessage = data.choices[0].message.content;
            setAiSummary(aiMessage);
        } catch (error) {
            console.error("Error fetching AI insights:", error);
            setAiSummary("Unable to generate insights at the moment.");
        }
    }
    return (
        <main className='container-fluid'>
            <div className="item">
                <h2>AI insights</h2>
                <div id="ai-summary">
                    <p>{aiSummary}</p>
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
                    <input type="number"
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
                <button onClick={() => navigate('/transactions')}
                    className="button2">
                    Transaction History
                </button>
            </div>
        </main>
    );
}