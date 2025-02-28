import React from 'react';

export function Login() {
    return (
        <main className='container-fluid'>
            <div className="item">
                <h2>Welcome to the Family Finance Manager</h2>
                <form method="get" action="dashboard.html">
                    <div>
                        <span>Name</span>
                        <input type="text" className="login-input" placeholder="your name" />
                    </div>
                    <div>
                        <span>Password</span>
                        <input type="password" className="login-input" placeholder="password" />
                    </div>
                    <div>
                        <span>Family ID</span>
                        <input type="password" className="login-input" placeholder="family ID" />
                    </div>

                    <button type="submit" className="button">Login</button>
                    <button type="submit" className="button">Create an account</button>
                </form>
            </div>
        </main>
    );
}