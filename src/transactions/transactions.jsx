import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Transactions() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [familyId, setFamilyId] = useState(localStorage.getItem('familyId'));
    const [editingTransactionId, setEditingTransactionId] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterType, setFilterType] = useState('');
    const [customCategory, setCustomCategory] = useState('');

    useEffect(() => {
        fetch(`/api/budgetData?familyId=${encodeURIComponent(familyId)}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                setTransactions(Array.isArray(data) ? data : []);
            })
            .catch((error) => console.error('Error fetching transactions:', error));
    }, [familyId]);

    const updateCategory = async (transactionId, updatedCategory) => {
        console.log('Updating category for transaction:', transactionId, updatedCategory); // Debug log

        try {
            const response = await fetch(`/api/budgetData`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transactionId, category: updatedCategory }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update category. Status: ${response.status}`);
            }

            // Update the local state to reflect the change
            setTransactions((prevTransactions) =>
                prevTransactions.map((transaction) =>
                    transaction._id === transactionId
                        ? { ...transaction, category: updatedCategory }
                        : transaction
                )
            );

            setEditingTransactionId(null); // Exit editing mode
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Failed to update category. Please try again.');
        }
    };

    const getFilteredTransactions = () => {
        return transactions.filter((transaction) => {
            const matchesCategory =
                !filterCategory || transaction.category === filterCategory;
            const matchesDate =
                !filterDate || new Date(transaction.date).toISOString().split('T')[0] === filterDate;
            const matchesType =
                !filterType || transaction.type === filterType;

            return matchesCategory && matchesDate && matchesType;
        });
    };

    const getTransactionRow = () => {
        const filteredTransactions = getFilteredTransactions();

        if (!Array.isArray(filteredTransactions)) {
            console.error('transactions is not an array:', filteredTransactions);
            return null; // Or a fallback UI
        }

        const sortedTransactions = [...filteredTransactions].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        return sortedTransactions.map((transaction) => (
            <div className="transaction-row" key={transaction._id}>
                <span className="date">{new Date(transaction.date).toLocaleDateString()}</span>
                <span
                    style={{ color: transaction.type === 'Income' ? 'green' : 'red' }}
                    className="amount"
                >
                    {transaction.type === 'Income' ? '+' : '-'}
                    {transaction.amount.toFixed(2)}
                </span>
                <span className="category">
                    {editingTransactionId === transaction._id ? (
                        <>
                            <select
                                value={newCategory}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === 'Custom') {
                                        setCustomCategory(''); // Clear custom category input
                                    }
                                    setNewCategory(value);
                                }}
                                onBlur={() => {
                                    const categoryToUpdate = newCategory === 'Custom' ? customCategory : newCategory;
                                    updateCategory(transaction._id, categoryToUpdate);
                                }}
                            >
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
                                <option>Facebook Marketplace</option>
                                <option>Gun Stuff</option>
                                <option>Rent</option>
                                <option>Utilities</option>
                                <option>Savings</option>
                                <option>Travel</option>
                                <option value="Custom">Custom</option>
                            </select>
                            {newCategory === 'Custom' && (
                                <input
                                    type="text"
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    placeholder="Enter custom category"
                                    onBlur={() => {
                                        if (customCategory.trim()) {
                                            updateCategory(transaction._id, customCategory);
                                        }
                                    }}
                                />
                            )}
                        </>
                    ) : (
                        <span
                            onClick={() => {
                                setEditingTransactionId(transaction._id);
                                setNewCategory(transaction.category);
                            }}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {transaction.category}
                        </span>
                    )}
                </span>
                <span className="notes">{transaction.notes}</span>
                <span className="member">{transaction.member}</span>
            </div>
        ));
    };

    return (
        <main className="container-fluid text-center">
            <div className="item">
                <button className="button2" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>
            <div className="filters">
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
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
                    <option>Facebook Marketplace</option>
                    <option>Gun Stuff</option>
                    <option>Rent</option>
                    <option>Utilities</option>
                    <option>Savings</option>
                    <option>Travel</option>
                </select>

                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                </select>
            </div>
            <div className="transaction-list">
                <h2>Transaction History</h2>
                <section>
                    <div className="history">
                        <div className="transaction-header">
                            <span>Date</span>
                            <span>Amount</span>
                            <span>Category of Expense</span>
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
        </main>
    );
}