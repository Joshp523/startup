import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MessageDialog } from './messageDialog';

export function Unauthenticated(props) {
    const [name, setName] = useState(props.userName || '');
    const [password, setPassword] = useState('');
    const [familyId, setFamilyId] = useState(props.familyId || '');
    const [displayError, setDisplayError] = useState(null);
    const navigate = useNavigate();

    function handleLogin() {
        //e.preventDefault();
        try {
            console.log('Logging in with:', { name, familyId, password });
            localStorage.setItem('userName', name);
            localStorage.setItem('familyId', familyId);
            localStorage.setItem('password', password);
            console.log('everything set to local storage');
            props.onLogin(name);
            console.log('props.login successfully called');
            
        } catch (error) {
            setDisplayError('Login failed');
        }
    }

    function handleCreateAccount() {
        //e.preventDefault();
        try {
            console.log('creating account with:', { name, familyId, password });
            localStorage.setItem('userName', name);
            localStorage.setItem('familyId', familyId);
            localStorage.setItem('password', password);
            props.onLogin(name);
            console.log('about to navigate to authenticated');
            
        } catch (error) {
            setDisplayError('Account creation failed');
        }
    }

    return (
        <main className='container-fluid'>
            <div className="item">
                <form onSubmit={handleLogin}>
                    <div>
                        <span>Name</span>
                        <input
                            type="text"
                            className="login-input"
                            placeholder="your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <span>Password</span>
                        <input
                            type="password"
                            className="login-input"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <span>Family ID</span>
                        <input
                            type="text"
                            className="login-input"
                            placeholder="family ID"
                            value={familyId}
                            onChange={(e) => setFamilyId(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit" 
                        className="button"
                        disabled={!name || !password}
                    >
                        Login
                    </Button>
                    <Button
                        type="button"
                        className="button"
                        onClick={handleCreateAccount}
                        disabled={!name || !password}
                    >
                        Create an account
                    </Button>
                </form>
            </div>
            <MessageDialog
                message={displayError}
                onHide={() => setDisplayError(null)}
            />
        </main>
    );
}