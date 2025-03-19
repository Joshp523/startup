import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import { MessageDialog } from './messageDialog';

export function Unauthenticated(props) {
    
    const [name, setName] = useState(props.userName);
    const [password, setPassword] = useState('');
    const [familyId, setFamilyId] = useState(props.familyId);
    const [displayError, setDisplayError] = React.useState(null);

    async function handleLogin() {
        localStorage.setItem('userName', name);
        localStorage.setItem('familyID', familyId);
        props.onLogin(familyID);
        props.onLogin(userName);
        navigate('/authenticated');
    };

    async function handleCreateAccount() {
        localStorage.setItem('userName', name);
        localStorage.setItem('familyID', familyId);
        props.onLogin(familyID)
        props.onLogin(userName);
        navigate('/authenticated');
    };

    return (
        <main className='container-fluid'>
            <div className="item">
                <form onSubmit = {handleLogin}>
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

                    <Button type="submit" className="button" onClick={() => handleLogin()} disabled={!userName || !password}>
                        Login
                    </Button>
                    <Button type="submit" className="button" onClick={() => handleCreateAccount()} disabled={!userName || !password}>
                        Create an account
                    </Button>
                </form>
            </div>
            <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
        </main>
    );
}