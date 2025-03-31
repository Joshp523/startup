import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './authenticated.css';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    (`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('userName');
        props.onLogout();
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
          console.log('Logout button clicked manually');
          logout();
        }}
      >
        Logout
      </Button>
    </div>
  );
}
