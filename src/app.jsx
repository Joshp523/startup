import React, { useState, useEffect } from 'react'; // Add useEffect import
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Routes, Route, useNavigate } from 'react-router-dom'; // Add useNavigate
import { Transactions } from './transactions/transactions';
import { Dashboard } from './dashboard/dashboard';
import { AuthState } from './login/authState';
import { Login } from './login/login';

export default function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem("userName") || '');
  const [familyId, setFamilyId] = useState(localStorage.getItem('familyId') || '');
  const [password, setPassword] = React.useState(localStorage.getItem("password") || '');
  const [authState, setAuthState] = React.useState(
    localStorage.getItem('userName') ? AuthState.Authenticated : AuthState.Unauthenticated
  );
  //const [shouldNavigate, setShouldNavigate] = useState(null); // State to trigger navigation

  const handleLogin = (newUserName) => {
    console.log('handleLogin called with:', newUserName);
    setUserName(newUserName);
    const storedFamilyId = localStorage.getItem('familyId') || '';
    const storedPassword = localStorage.getItem('password') || '';
    setFamilyId(storedFamilyId);
    setPassword(storedPassword);
    setAuthState(AuthState.Authenticated);
    setShouldNavigate('/authenticated'); 
    console.log('handleLogin completed');
  };

  const handleLogout = () => {
    console.log('handleLogout called');
    setUserName('');
    setFamilyId('');
    setPassword('');
    setAuthState(AuthState.Unauthenticated);
    setShouldNavigate('/unauthenticated'); 
    localStorage.removeItem('userName');
    localStorage.removeItem('familyId');
    localStorage.removeItem('password');
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
                    <NavLink className="nav-link" to="/dashboard">
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/transactions">
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
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(newUserName, newAuthState) => {
                  if (newAuthState === AuthState.Authenticated) {
                    handleLogin(newUserName);
                  } else {
                    handleLogout();
                  }
                }}
              />
            }
            exact
          />
          <Route
            path="/authenticated"
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(newUserName, newAuthState) => {
                  if (newAuthState === AuthState.Authenticated) {
                    handleLogin(newUserName);
                  } else {
                    handleLogout();
                  }
                }}
              />
            }
          />
          <Route
            path="/unauthenticated"
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(newUserName, newAuthState) => {
                  if (newAuthState === AuthState.Authenticated) {
                    handleLogin(newUserName);
                  } else {
                    handleLogout();
                  }
                }}
              />
            }
          />
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
    <main className='container-fluid'>
      <div>404: Page not found</div>
    </main>
  );
}