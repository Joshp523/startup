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

    async function handleLogin(e) {
        e.preventDefault();
        try {
            await loginOrCreate(`/api/auth/login`);
            // localStorage.setItem('userName', name);
            // localStorage.setItem('familyId', familyId);
            // localStorage.setItem('password', password);
        } catch (error) {
            setDisplayError('Login failed');
        }
    }

    async function handleCreateAccount(e) {
        //e.preventDefault();
        try {
            await loginOrCreate(`/api/auth/create`);
             // localStorage.setItem('userName', name);
            // localStorage.setItem('familyId', familyId);
            // localStorage.setItem('password', password);
        } catch (error) {
            setDisplayError('Account creation failed');
        }
    }

    async function loginOrCreate(endpoint) {
        const response = await fetch(endpoint, {
            method: 'post',
            body: JSON.stringify({ name: name, password: password, familyId: familyId }),
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            
            },
        });
        if (response?.status === 200) {
            localStorage.setItem('name', name);
            localStorage.setItem('familyId', familyId);
            props.onLogin(name);
            navigate('/authenticated');
        } else {
            const body = await response.json();
            setDisplayError(`⚠ Error: ${body.msg}`);
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
                        disabled={!name || !password || !familyId}
                    >
                        Login
                    </Button>
                    <Button
                        type="button"
                        className="button"
                        onClick={handleCreateAccount}
                        disabled={!name || !password || !familyId}
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