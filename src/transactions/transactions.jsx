import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Transactions() {

    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const familyID = localStorage.getItem('familyID');
        const allData = JSON.parse(localStorage.getItem('budgetData')) || {};
        const savedTransactions = allData[familyID] || [];
        setTransactions(savedTransactions);
      }, []);

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