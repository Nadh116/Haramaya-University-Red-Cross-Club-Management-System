import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { contactAPI } from '../../services/api';

const AuthDebugger = () => {
    const { user, token, loading } = useAuth();
    const [debugInfo, setDebugInfo] = useState({});
    const [testResults, setTestResults] = useState({});

    useEffect(() => {
        // Collect debug information
        const info = {
            token: token ? 'Present' : 'Missing',
            tokenLength: token ? token.length : 0,
            user: user ? {
                id: user._id,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                firstName: user.firstName,
                lastName: user.lastName
            } : null,
            localStorage: {
                token: localStorage.getItem('token') ? 'Present' : 'Missing',
                tokenValue: localStorage.getItem('token')?.substring(0, 20) + '...'
            },
            loading,
            currentPath: window.location.pathname
        };
        setDebugInfo(info);
    }, [user, token, loading]);

    const testContactAPI = async () => {
        console.log('🧪 Testing Contact API...');
        const results = {};

        try {
            console.log('📡 Testing GET /api/contact...');
            const response = await contactAPI.getContacts({ page: 1, limit: 5 });
            results.getContacts = {
                success: true,
                status: 200,
                contactCount: response.data.data.contacts.length,
                message: 'Success'
            };
            console.log('✅ Contact API test successful');
        } catch (error) {
            results.getContacts = {
                success: false,
                status: error.response?.status || 'Network Error',
                message: error.response?.data?.message || error.message,
                details: error.response?.data
            };
            console.log('❌ Contact API test failed:', error);
        }

        try {
            console.log('📡 Testing GET /api/contact/statistics...');
            const response = await contactAPI.getStatistics();
            results.getStatistics = {
                success: true,
                status: 200,
                message: 'Success'
            };
            console.log('✅ Statistics API test successful');
        } catch (error) {
            results.getStatistics = {
                success: false,
                status: error.response?.status || 'Network Error',
                message: error.response?.data?.message || error.message
            };
            console.log('❌ Statistics API test failed:', error);
        }

        setTestResults(results);
    };

    const clearTokenAndReload = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'white',
            border: '2px solid #dc2626',
            borderRadius: '8px',
            padding: '15px',
            maxWidth: '400px',
            fontSize: '12px',
            zIndex: 9999,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#dc2626' }}>🔍 Auth Debugger</h3>

            <div style={{ marginBottom: '10px' }}>
                <strong>Authentication Status:</strong>
                <div>Token: <span style={{ color: debugInfo.token === 'Present' ? 'green' : 'red' }}>
                    {debugInfo.token}
                </span></div>
                <div>Loading: {loading ? 'Yes' : 'No'}</div>
                <div>User: {user ? `${user.firstName} ${user.lastName} (${user.role})` : 'Not loaded'}</div>
                <div>Active: {user?.isActive ? 'Yes' : 'No'}</div>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>Debug Info:</strong>
                <pre style={{
                    background: '#f5f5f5',
                    padding: '5px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    maxHeight: '100px',
                    overflow: 'auto'
                }}>
                    {JSON.stringify(debugInfo, null, 2)}
                </pre>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <button
                    onClick={testContactAPI}
                    style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '5px'
                    }}
                >
                    Test Contact API
                </button>
                <button
                    onClick={clearTokenAndReload}
                    style={{
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Clear Token
                </button>
            </div>

            {Object.keys(testResults).length > 0 && (
                <div>
                    <strong>Test Results:</strong>
                    <pre style={{
                        background: '#f5f5f5',
                        padding: '5px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        maxHeight: '100px',
                        overflow: 'auto'
                    }}>
                        {JSON.stringify(testResults, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default AuthDebugger;