import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Transactions() {

    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [familyId, setFamilyId] = useState(localStorage.getItem('familyId'));
    
        React.useEffect(() => {
            fetch('/api/budgetData', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ familyId })
            })
                .then((response) => response.json())
                .then((transactions) => {
                    setTransactions(transactions);
                })
                .catch((error) => console.error("Error fetching transactions:", error));
        }, [transactionUpdate, familyId]);

    // useEffect(() => {
    //     const handleStorageChange = () => {
    //         const newFamilyId = localStorage.getItem('familyId');
    //         setFamilyId(newFamilyId);
    //     };

    //     window.addEventListener('storage', handleStorageChange);

    //     if (familyId) {
    //         const allData = JSON.parse(localStorage.getItem('budgetData')) || {};
    //         const savedTransactions = allData[familyId] || [];
    //         setTransactions(savedTransactions);
    //     } else {
    //         setTransactions([]);
    //     }

    //     return () => window.removeEventListener('storage', handleStorageChange);
    // }, [familyId]);

    const getTransactionRow = () => {
        return transactions.map((transaction) => (
            <div className="transaction-row" key={transaction.id}>
                <span className="date">{new Date(transaction.date).toLocaleDateString()}</span>
                <span
                    style={{ color: transaction.type === 'Income' ? 'green' : 'red' }}
                    className="amount"
                >
                    {transaction.type === 'Income' ? '+' : '-'}
                    {transaction.amount.toFixed(2)}
                </span>
                <span className="category">{transaction.category}</span>
                <span className="notes">{transaction.notes}</span>
                <span className="member">{transaction.member}</span>
            </div>
        ));
    };

    return (
        <main className='container-fluid text-center'>
            <div className="transaction-list">
                <h2>Transaction History</h2>
                <section>
                    <div className="history">
                        <div className="transaction-header">
                            <span>Date</span>
                            <span>Amount </span>
                            <span>Category of Expense </span>
                            <span>Notes</span>
                            <span>Family Member</span>
                        </div>
                        {transactions.length === 0 ? (
                            <p>No transactions yet.</p>
                        ) : (
                            getTransactionRow()
                        )}
                    </div>
                </section>
            </div>
            <div className="item">
                <button className="button2" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </div>
        </main>
    );
}