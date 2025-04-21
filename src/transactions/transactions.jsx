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
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, transactionId: null });

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

    const updateNote = async (transactionId, updatedNote) => {
        try {
            const response = await fetch(`/api/budgetData`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transactionId, notes: updatedNote }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to update note. Status: ${response.status}`);
            }
    
            setTransactions((prevTransactions) =>
                prevTransactions.map((transaction) =>
                    transaction._id === transactionId
                        ? { ...transaction, notes: updatedNote }
                        : transaction
                )
            );
        } catch (error) {
            console.error('Error updating note:', error);
            alert('Failed to update note. Please try again.');
        }
    };

    const deleteTransaction = async (transactionId) => {
        try {
            const response = await fetch(`/api/budgetData`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transactionId }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to delete transaction. Status: ${response.status}`);
            }
    
            setTransactions((prevTransactions) =>
                prevTransactions.filter((transaction) => transaction._id !== transactionId)
            );
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Failed to delete transaction. Please try again.');
        }
    };

    const getFilteredTransactions = () => {
        return transactions.filter((transaction) => {
            const matchesCategory =
                !filterCategory || transaction.category.toLowerCase().includes(filterCategory.toLowerCase());
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
                                    if (categoryToUpdate.trim()) {
                                        updateCategory(transaction._id, categoryToUpdate);
                                    }
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
                <span className="notes">
                    {editingNoteId === transaction._id ? (
                        <input
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onBlur={() => {
                                updateNote(transaction._id, newNote);
                                setEditingNoteId(null);
                            }}
                            placeholder="Enter new note"
                        />
                    ) : (
                        <span
                            onClick={() => {
                                setEditingNoteId(transaction._id);
                                setNewNote(transaction.notes);
                            }}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {transaction.notes}
                        </span>
                    )}
                </span>
                <span className="member">{transaction.member}</span>
                <button
                    onClick={() => deleteTransaction(transaction._id)}
                >
                    Delete
                </button>
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
                <input
                    type="text"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    placeholder="Filter by category"
                />

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