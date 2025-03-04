import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [familyId, setFamilyId] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    const handleCreateAccount = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <main className='container-fluid'>
            <div className="item">
                <h2>Welcome to the Family Finance Manager</h2>
                <form onSubmit= {handleLogin}>
                    <div>
                        <span>Name</span>
                        <input type="text" 
                               className="login-input" 
                               placeholder="your name"
                               value={name}
                               onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <span>Password</span>
                        <input type="password" 
                               className="login-input" 
                               placeholder="password" 
                               value={password}
                               onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <span>Family ID</span>
                        <input type="password" 
                               className="login-input" 
                               placeholder="family ID" 
                               value={password}
                               onChange={(e) => setFamilyId(e.target.value)} />
                    </div>

                    <button type="submit" className="button">
                        Login
                    </button>
                    <button type="submit" className="button" onClick={handleCreateAccount}>
                        Create an account
                    </button>
                </form>
            </div>
        </main>
    );
}