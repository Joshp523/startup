import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import { Notifier } from '../notifier.js';


ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

export function Dashboard() {

    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [goal, setGoal] = useState('');
    const [aiSummary, setAiSummary] = useState("Loading AI insights...");
    const navigate = useNavigate();
    const [transactionUpdate, setTransactionUpdate] = useState(false);
    const [goals, setGoals] = React.useState([]);
    const [transactions, setTransactions] = React.useState([]);
    const [familyId, setFamilyId] = useState(localStorage.getItem('familyId'));
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';

    const notifier = new Notifier();

    async function getTransactions() {
        const budgetResponse = await fetch(`/api/budgetData?familyId=${encodeURIComponent(familyId)}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        if (budgetResponse.status !== 200) throw new Error('Failed to fetch budget data');
        const budgetData = await budgetResponse.json();
        return budgetData;
    }

    async function getGoals() {
        const goalResponse = await fetch(`/api/goalData?familyId=${encodeURIComponent(familyId)}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        if (goalResponse.status !== 200) throw new Error('Failed to fetch goal data');
        const goalData = await goalResponse.json();
        console.log('goalData from getGoals:', goalData);
        return goalData;
    }

    useEffect(() => {

        const handleStorageChange = () => {
            const newFamilyID = localStorage.getItem('familyId');
            setFamilyID(newFamilyID);
        };

        window.addEventListener('storage', handleStorageChange);


        if (familyId) {
            Promise.all([getTransactions(), getGoals()])
                .then(([budgetData, goalData]) => {
                    setTransactions(budgetData);
                    setGoals(goalData);
                    generateGraphs(budgetData);
                    generateAiSummary(budgetData, goalData);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setAiSummary("Unable to generate insights at the moment.");
                });
        } else {
            navigate('/login');
        }

        return () => window.removeEventListener('storage', handleStorageChange);
    }, [transactionUpdate, familyId]);

    const handleGoal = (e) => {
        e.preventDefault();
        const newGoal = {
            goal: goal,
            date: new Date().toISOString(),
        };
        addGoal(familyId, newGoal);
        setGoal('');
        setTransactionUpdate((prev) => prev + 1);
    }

    const handleTransaction = (e) => {
        e.preventDefault();
        const newTransaction = {
            amount: Number(amount),
            type,
            category,
            notes,
            member: localStorage.getItem('name'),
            date: new Date().toISOString(),
        };
        addTransaction(familyId, newTransaction);
        setAmount('');
        setType('Expense');
        setCategory('');
        setNotes('');
        setTransactionUpdate((prev) => prev + 1);
        //navigate('/transactions');
    }

    const summarizeSpending = (transactions) => {

        const categoryBreakdown = {};
        const dateBreakdown = {};

        transactions.forEach((transaction) => {
            if (transaction.type === 'Expense') {
                if (!categoryBreakdown[transaction.category + ': ' + transaction.notes]) {
                    categoryBreakdown[transaction.category + ': ' + transaction.notes] = 0;
                }
                categoryBreakdown[transaction.category + ': ' + transaction.notes] += transaction.amount;

                if (!dateBreakdown[transaction.date]) {
                    dateBreakdown[transaction.date] = 0;
                }
                dateBreakdown[transaction.date] += transaction.amount;
            }
        });

        const summary = `
          Category Breakdown:
          ${Object.entries(categoryBreakdown)
                .map(([category, amount]) => `${category}: $${amount.toFixed(2)}`)
                .join("\n")}
        `;

        return summary;
    };

    const prepareDataForCharts = (transactions) => {
        let totalIncome = 0;
        let totalExpenses = 0;
        const categoryBreakdown = {};
        const incomeBreakdown = {};
        transactions.forEach((transaction) => {
            if (transaction.type === "Income") {
                totalIncome += transaction.amount;
                if (!incomeBreakdown[transaction.category]) {
                    incomeBreakdown[transaction.category] = 0;
                }
                incomeBreakdown[transaction.category] += transaction.amount;
            } else if (transaction.type === "Expense") {
                totalExpenses += transaction.amount;
                if (transaction.category !== "savings") {
                    if (!categoryBreakdown[transaction.category]) {
                        categoryBreakdown[transaction.category] = 0;
                    }
                    categoryBreakdown[transaction.category] += transaction.amount;
                }
            }
        }
        );
        return {
            totalIncome,
            totalExpenses,
            netBalance: totalIncome - totalExpenses,
            categoryBreakdown, // Object with category names as keys and amounts as values
            incomeBreakdown,
        };
    };

    const summarizeGoals = (goals) => {
        if (goals.length === 0) {
            return "No goals set yet.";
        } else return goals;
    };
    const goalSummary = summarizeGoals(goals);

    const [spendingData, setSpendingData] = useState(null);

    async function generateGraphs(budgetData) {
        const data = prepareDataForCharts(budgetData);
        setSpendingData(data);
    }

    async function generateAiSummary(budgetData, goalData) {

        if (budgetData.length === 0) {
            setAiSummary("No transactions recorded yet. Start logging to get AI insights!");
            return;
        }

        const spendingSummary = summarizeSpending(budgetData);
        const goalSummary = summarizeGoals(goalData);

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {

                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "system", content: "You are a financial assistant providing budget insights for a young family trying to build their savings and spend responsibly. children are very important to them. answer each prompt as simply as you can." },
                    { role: "user", content: `Comment on how this week or month's spending compares to previous spending patterns. higher or lower? Tell us concisely our percent progress toward each specific goal (i.e. you are 40% of the way to meeting your goal of saving a million dollars! keep it up! or "you have already spent x dollars on fast food. keep it under $x more in the next x days to meet your goal!"). :\n${spendingSummary}\n${goalSummary}` }]
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
    async function addTransaction(familyId, transaction) {
        try {
            const response = await fetch('/api/budgetData', {
                method: 'POST',
                credentials: 'include',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ familyId, transaction }),
            });
        } catch (error) {
            console.error('Error adding transaction:', error.message);
            if (error.message.includes('401')) {
                setAiSummary('Session expired. Please log in again.');
                navigate('/login');
            }
            throw error;
        }
        setTransactionUpdate((prev) => prev + 1);
    }

    async function addGoal(familyId, goal) {
        await fetch(`/api/goalData?familyId=${encodeURIComponent(familyId)}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ goal, family: familyId }),
        });
        setTransactionUpdate((prev) => prev + 1);
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
                <h2>Spending Overview</h2>
                {spendingData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Bar Chart: Income, Expenses, Net Balance */}
                        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                            <h3>Income vs Expenses</h3>
                            <Bar
                                data={{
                                    labels: ['Total Income', 'Total Expenses', 'Net Balance'],
                                    datasets: [
                                        {
                                            label: 'Amount ($)',
                                            data: [
                                                spendingData.totalIncome,
                                                spendingData.totalExpenses,
                                                spendingData.netBalance,
                                            ],
                                            backgroundColor: [
                                                'rgba(75, 192, 192, 0.6)',
                                                'rgba(255, 99, 132, 0.6)',
                                                spendingData.netBalance >= 0
                                                    ? 'rgba(54, 162, 235, 0.6)'
                                                    : 'rgba(255, 206, 86, 0.6)',
                                            ],
                                            borderColor: [
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                spendingData.netBalance >= 0
                                                    ? 'rgba(54, 162, 235, 1)'
                                                    : 'rgba(255, 206, 86, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                                options={{
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            title: {
                                                display: true,
                                                text: 'Amount ($)',
                                            },
                                        },
                                    },
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        </div>

                        {/* Pie Chart: Category Breakdown */}
                        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                            <h3>Spending by Category</h3>
                            <Pie
                                data={{
                                    labels: Object.keys(spendingData.categoryBreakdown),
                                    datasets: [
                                        {
                                            label: 'Spending by Category',
                                            data: Object.values(spendingData.categoryBreakdown),
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.6)',
                                                'rgba(54, 162, 235, 0.6)',
                                                'rgba(255, 206, 86, 0.6)',
                                                'rgba(75, 192, 192, 0.6)',
                                                'rgba(153, 102, 255, 0.6)',
                                                'rgba(255, 159, 64, 0.6)',
                                                'rgba(199, 199, 199, 0.6)',
                                                'rgba(83, 102, 255, 0.6)',
                                                'rgba(255, 99, 255, 0.6)',
                                                'rgba(99, 255, 132, 0.6)',
                                            ],
                                            borderColor: [
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(199, 199, 199, 1)',
                                                'rgba(83, 102, 255, 1)',
                                                'rgba(255, 99, 255, 1)',
                                                'rgba(99, 255, 132, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                                options={{
                                    plugins: {
                                        legend: {
                                            position: 'right',
                                        },
                                    },
                                }}
                            />
                        </div>
                        {/* Pie Chart: Category Breakdown */}
                        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                            <h3>Income by Category</h3>
                            <Pie
                                data={{
                                    labels: Object.keys(spendingData.incomeBreakdown),
                                    datasets: [
                                        {
                                            label: 'Income by Category',
                                            data: Object.values(spendingData.incomeBreakdown),
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.6)',
                                                'rgba(54, 162, 235, 0.6)',
                                                'rgba(255, 206, 86, 0.6)',
                                                'rgba(75, 192, 192, 0.6)',
                                                'rgba(153, 102, 255, 0.6)',
                                                'rgba(255, 159, 64, 0.6)',
                                                'rgba(199, 199, 199, 0.6)',
                                                'rgba(83, 102, 255, 0.6)',
                                                'rgba(255, 99, 255, 0.6)',
                                                'rgba(99, 255, 132, 0.6)',
                                            ],
                                            borderColor: [
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(199, 199, 199, 1)',
                                                'rgba(83, 102, 255, 1)',
                                                'rgba(255, 99, 255, 1)',
                                                'rgba(99, 255, 132, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                                options={{
                                    plugins: {
                                        legend: {
                                            position: 'right',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <p>No spending data to display. Add transactions to see charts.</p>
                )}
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
                        <option>Junk food</option>
                        <option>Gifts</option>
                        <option>Gas</option>
                        <option>Wholesome Recreational Activities</option>
                        <option>Home</option>
                        <option>Clothes</option>
                        <option>Classifieds</option>
                        <option>Gun Stuff</option>
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
                <h2>Set a New Goal!</h2>
                <form onSubmit={handleGoal}>

                    <input type="text"
                        name="goal"
                        placeholder="Enter a goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />
                    <button type="submit"
                        className="button">
                        Submit Goal
                    </button>
                </form>
            </div>
            <div className="item">
                <h2>Your Goals</h2>
                {goals.length > 0 ? (
                    <ul>
                        {goals.map((g) => (
                            <li key={g._id}>
                                Goal:  {g.goal}   (Set on {new Date(g.date).toLocaleDateString()})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No goals set yet.</p>
                )}
            </div>

            <div className="item">
                <button onClick={() => navigate('/transactions')}
                    className="button2">
                    Transaction History
                </button>
            </div>
            <div className="item">
                <button onClick={() => notifier.broadcastEvent({ name: localStorage.getItem('name') })}
                    className="button2">
                    Cick if you met your goal!
                </button>
            </div>
        </main>
    );
}