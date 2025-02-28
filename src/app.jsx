import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    return <div className='body bg-dark text-light'> 
    <header>
    <h1>Family Budget</h1>

    <nav>
      <menu class="nav-menu">
        <li><a href="index.html">Logout</a></li>
        <li><a href="dashboard.html">Dashboard</a></li>
        <li><a href="transactions.html">Transaction History</a></li>
      </menu>
    </nav>

    <hr />
  </header>

  <main className='container-fluid bg-secondary text-center'>App components go here</main>
  
  <footer>
    <hr />
    <span className="footer-text">a startup by Joshua Riley</span>
    <br />
    <a href="https://github.com/Joshp523/startup.git" className="github-link">GitHub</a>
  </footer>
  
  </div>;
}