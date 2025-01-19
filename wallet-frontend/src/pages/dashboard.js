// src/pages/Dashboard.js
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
        try {
            const data = await walletService.getBalance();
            setBalance(data.balance);
        } catch (err) {
            if (err.response?.status === 401) {
                authService.logout();
                navigate('/');
            } else {
                setError('Failed to fetch balance. Please try again.');
            }
        }
    };

    const fetchTransactions = async () => {
        try {
            const data = await walletService.getTransactions();
            setTransactions(data);
        } catch (err) {
            setError('Failed to fetch transactions. Please try again.');
        }
    };

    const handleTransaction = async (type) => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount greater than zero.');
            return;
        }

        if (type === 'withdraw' && parseFloat(amount) > balance) {
            setError('Insufficient balance.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (type === 'deposit') {
                await walletService.deposit(parseFloat(amount));
            } else {
                await walletService.withdraw(parseFloat(amount));
            }
            await fetchBalance();
            await fetchTransactions();
            setAmount('');
            setActiveModal(null);
        } catch (err) {
            setError(err.response?.data?.error || `Failed to ${type}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                        <button 
                            onClick={() => setActiveModal('deposit')}
                            className="action-button deposit"
                        >
                            Deposit
                        </button>
                        <button 
                            onClick={() => setActiveModal('withdraw')}
                            className="action-button withdraw"
                        >
                            Withdraw
                        </button>
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
                            <button 
                                onClick={() => setActiveModal(null)} 
                                className="cancel-button"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleTransaction(activeModal)}
                                disabled={loading}
                            >
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
