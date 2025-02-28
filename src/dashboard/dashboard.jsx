import React from 'react';

export function Dashboard() {
    return (
        <main className='container-fluid'>
            <div className="item">
                <h2>Your Monthly Spending</h2>
                <div id="picture">
                    <img src="images/placeholder.jpg" alt="Pie chart" />
                </div>
            </div>
            <div className="item">
                <h2>Log a New Transaction</h2>
                <form action="form.html" method="post" id="transactionForm">
                    <select name="type">
                        <option>Select an option</option>
                        <option>Expense</option>
                        <option>Income</option>
                    </select>
                    <select name="category">
                        <option>Select an option</option>
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
                    <input type="text" name="amount" placeholder="$ amount" required></input>
                    <button type="submit" className="button">Submit</button>
                </form>
            </div>

            <div className="item">
                <button onclick="location.href='transactions.html';" className="button2">Transaction History</button>
            </div>
        </main>
    );
}