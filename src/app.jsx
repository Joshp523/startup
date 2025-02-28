import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Transactions } from './transactions/transactions';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';


export default function App() {
    return (
        <BrowserRouter>
            <div className='body'>
                <header>
                    <h1>Family Budget</h1>

                    <nav>
                        <menu className="nav-menu">
                            <li><NavLink className="nav-link" to="/">Logout</NavLink></li>
                            <li><NavLink className="nav-link" to="dashboard">Dashboard</NavLink></li>
                            <li><NavLink className="nav-link" to="transactions">Transaction History</NavLink></li>
                        </menu>
                    </nav>

                    <hr />
                </header>

                <Routes>
                    <Route path="/" element={<Login />} />
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
        <main className='container-fluid '>
            <div> 404: Page not found</div>
        </main>
    );
}