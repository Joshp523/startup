import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Transactions() {

    const navigate = useNavigate();

    const getTransactionRow = () => {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            return (
                <div className="transaction-row" key={transaction.id}>
                    <span style={{ color: transaction.type === 'expense' ? 'red' : 'green' }} className="amount">
                        {transaction.amount}
                    </span>
                    <span className="category">{transaction.category}</span>
                    <span className="member">{transaction.member}</span>
                </div>
            );
    }

    return (
        <main className='container-fluid text-center'>
            <div className="item">
                <h2>Transaction History</h2>
                <section>
                    <div className="history">
                        <div className="transaction-header">
                            <span>Amount </span>
                            <span>Category of Expense </span>
                            <span>Family Member</span>
                        </div>
                        <div className="transaction-row">
                            <span style={{ color: 'green' }} className="amount">+60</span>
                            <span className="category">Piano Lessons</span>
                            <span className="member">Meishe</span>
                        </div>
                        <div className="transaction-row">
                            <span style={{ color: 'red' }} className="amount">-105</span>
                            <span className="category">Car Parts</span>
                            <span className="member">Josh</span>
                        </div>
                    </div>
                </section>
            </div>
            <div className="item">
                <button className="button2" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </div>
        </main>
    );
}