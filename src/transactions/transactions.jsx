import React from 'react';

export function Transactions() {
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
                            <span style={{color: 'green'}} className="amount">+60</span>
                            <span className="category">Piano Lessons</span>
                            <span className="member">Meishe</span>
                        </div>
                        <div className="transaction-row">
                            <span style={{color: 'red'}} className="amount">-105</span>
                            <span className="category">Car Parts</span>
                            <span className="member">Josh</span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}