import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './authenticated.css';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    console.log('Logout clicked');
    localStorage.removeItem('userName');
    localStorage.removeItem('userName');
    localStorage.removeItem('familyId');
    localStorage.removeItem('password');
    props.onLogout();
    navigate('/unauthenticated');
  }

  return (
    <div>
      <div className='Name'>{props.userName}</div>
      <Button variant='primary' onClick={() => navigate('/dashboard')}>
        Dashboard
      </Button>
      <Button variant='secondary' onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
