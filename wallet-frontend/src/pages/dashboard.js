import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { walletService, authService } from '../services/api';
import '../assets/css/dashboard.css';

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    // Fetch balance logic
  };

  const fetchTransactions = async () => {
    // Fetch transactions logic
  };

  const handleTransaction = async (type) => {
    // Handle transaction logic
  };

  const handleLogout = () => {
    // Logout logic
  };

  const formatDate = (dateString) => {
    // Format date logic
  };

  const generateReport = () => {
    // Generate report logic
    console.log('Generating report...');
  };

  return (
    <div className="dashboard-wrapper">
      <nav className="dashboard-nav">
        <h1>Wallet Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>

      <div className="dashboard-content">
        <div className="balance-card">
          <div className="balance-info">
            <h2>Current Balance</h2>
            <p className="balance-amount">${balance.toFixed(2)}</p>
          </div>
          <div className="balance-actions">
            <button onClick={() => setActiveModal('deposit')} className="action-button deposit">Deposit</button>
            <button onClick={() => setActiveModal('withdraw')} className="action-button withdraw">Withdraw</button>
          </div>
        </div>

        <div className="transactions-section">
          <h2>Recent Transactions</h2>
          <div className="transactions-list">
            {transactions.length === 0 ? (
              <p className="no-transactions">No transactions yet</p>
            ) : (
              transactions.map((transaction, index) => (
                <div key={transaction.id || index} className="transaction-item">
                  <div className="transaction-info">
                    <span className={`transaction-type ${transaction.transaction_type.toLowerCase()}`}>
                      {transaction.transaction_type}
                    </span>
                    <span className="transaction-date">
                      {formatDate(transaction.timestamp)}
                    </span>
                  </div>
                  <span className={`transaction-amount ${transaction.transaction_type.toLowerCase()}`}>
                    {transaction.transaction_type === 'DEPOSIT' ? '+' : '-'}
                    ${transaction.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="report-section">
          <button onClick={generateReport} className="report-button">Generate Report</button>
        </div>
      </div>

      {activeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{activeModal === 'deposit' ? 'Deposit' : 'Withdraw'} Funds</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={loading}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setActiveModal(null)} className="cancel-button" disabled={loading}>
                Cancel
              </button>
              <button onClick={() => handleTransaction(activeModal)} disabled={loading}>
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;