import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './authenticated.css';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .catch(() => {
        console.error('Logout request failed');
      })
      .finally(() => {
        localStorage.removeItem('name', 'familyId');
        props.onLogout();
        navigate('/login');
      });
  }

  return (
    <div>
      <div className='Name'>{props.userName}</div>
      <Button variant='primary' onClick={() => navigate('/dashboard')}>
        Dashboard
      </Button>
      <Button
        variant='secondary'
        onClick={() => {
          logout();
        }}
      >
        Logout
      </Button>
    </div>
  );
}
