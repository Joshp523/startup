import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter as NavLink, Route, Routes } from 'react-router-dom';
import { Transactions } from './transactions/transactions';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { BrowserRouter } from 'react-router-dom/dist';

export default function App() {
    return (
        <BrowserRouter>
            <div className='body bg-dark text-light'>
                <header>
                    <h1>Family Budget</h1>

                    <nav>
                        <menu class="nav-menu">
                            <li><NavLink href="index.html">Logout</a></li>
                            <li><NavLink href="dashboard.html">Dashboard</a></li>
                            <li><NavLink href="transactions.html">Transaction History</a></li>
                        </menu>
                    </nav>

                    <hr />
                </header>

                <Routes>
                    <Route path="/" element={<Login />} exact />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

                <footer>
                    <hr />
                    <span className="footer-text">a startup by Joshua Riley</span>
                    <br />
                    <a href="https://github.com/Joshp523/startup.git" className="github-link">GitHub</a>
                </footer>

            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return (
        <main className='container-fluid bg-secondary text-center'>
            <div> 404: Page not found</div>
        </main>
    );
}