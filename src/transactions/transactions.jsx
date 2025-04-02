import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Transactions() {

    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [familyId, setFamilyId] = useState(localStorage.getItem('familyId'));
    
        React.useEffect(() => {
            fetch(`/api/budgetData?familyId=${encodeURIComponent(familyId)}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
              })
              .then((data) => {
                // Ensure data is an array; default to empty array if not
                setTransactions(Array.isArray(data) ? data : []);
              })
                .catch((error) => console.error("Error fetching transactions:", error));
        }, [ familyId ]);

    const getTransactionRow = () => {
        if (!Array.isArray(transactions)) {
            console.error("transactions is not an array:", transactions);
            return null; // Or a fallback UI
          }
        return transactions.map((transaction) => (
            <div className="transaction-row" key={transaction.id || index}>
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