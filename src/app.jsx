import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Transactions } from './transactions/transactions';
import { Dashboard } from './dashboard/dashboard';
import { Unauthenticated } from './login/unauthenticated';
import { Authenticated } from './login/authenticated';
import { AuthState } from './login/authState';


export default function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem("userName") || '');
    const [familyId, setFamilyId] = useState(localStorage.getItem('familyId') || '');
    const [password, setPassword] = React.useState(localStorage.getItem("password") || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(localStorage.getItem('userName') ? AuthState.Authenticated : AuthState.Unauthenticated);

    const handleLogin = (loginData) => {
        setUserName(loginData.userName);
        setFamilyId(loginData.familyId);
        setPasssword(loginData.password);
        setAuthState(AuthState.Authenticated);
    };

    const handleLogout = () => {
        setUserName('');
        setFamilyId('');
        setPassword('');
        setAuthState(AuthState.Unauthenticated);
    };

    return (
        <BrowserRouter>
            <div className='body'>
                <header>
                    <h1>Family Budget</h1>

                    <nav>
                        <menu className="nav-menu">
                            {authState === AuthState.Authenticated ? (
                                <>
                                    <li>
                                        <NavLink className="nav-link" to="/" onClick={handleLogout}>
                                            Logout
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="nav-link" to="./dashboard">
                                            Dashboard
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="nav-link" to="./transactions">
                                            Transaction History
                                        </NavLink>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <NavLink className="nav-link" to="/">
                                        Login
                                    </NavLink>
                                </li>
                            )}
                        </menu>
                    </nav>

                    <hr />
                </header>

                <Routes>

                    <Route
                        path="/"
                        element={
                            authState === AuthState.Authenticated ? (
                                <Authenticated
                                    userName={userName}
                                    familyId={familyId}
                                    onLogin={handleLogin}
                                    onLogout={handleLogout}
                                />
                            ) : (
                                <Unauthenticated
                                    userName={userName}
                                    familyId={familyId}
                                    onLogin={handleLogin}
                                    onLogout={handleLogout}
                                />
                            )
                        }
                        exact
                    />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/authenticated" element={<Authenticated />} />
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