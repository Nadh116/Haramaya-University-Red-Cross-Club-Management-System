import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DebugAuth = () => {
    const { user, token, loading, error, login, logout } = useAuth();
    const [testResults, setTestResults] = useState({});
    const [logs, setLogs] = useState([]);

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = { timestamp, message, type };
        setLogs(prev => [...prev, logEntry]);
        console.log(`[${timestamp}] ${message}`);
    };

    useEffect(() => {
        addLog('🚀 DebugAuth component mounted', 'info');
        addLog(`📊 Initial state - User: ${user ? 'Present' : 'None'}, Token: ${token ? 'Present' : 'None'}, Loading: ${loading}`, 'info');
    }, []);

    useEffect(() => {
        if (user) {
            addLog(`👤 User state updated: ${user.firstName} ${user.lastName} (${user.role})`, 'success');
        }
    }, [user]);

    useEffect(() => {
        if (error) {
            addLog(`❌ Auth error: ${error}`, 'error');
        }
    }, [error]);

    const testDirectLogin = async () => {
        addLog('🔍 Testing direct login...', 'info');
        setTestResults(prev => ({ ...prev, directLogin: 'testing...' }));

        try {
            const result = await login('admin@haramaya.edu.et', 'admin123');
            addLog(`📋 Login result: ${JSON.stringify(result)}`, result.success ? 'success' : 'error');
            setTestResults(prev => ({
                ...prev,
                directLogin: result.success ? 'SUCCESS' : `FAILED: ${result.error}`
            }));
        } catch (error) {
            addLog(`❌ Login exception: ${error.message}`, 'error');
            setTestResults(prev => ({
                ...prev,
                directLogin: `ERROR: ${error.message}`
            }));
        }
    };

    const testAPICall = async () => {
        addLog('📡 Testing direct API call...', 'info');
        setTestResults(prev => ({ ...prev, apiCall: 'testing...' }));

        try {
            const response = await api.post('/auth/login', {
                email: 'admin@haramaya.edu.et',
                password: 'admin123'
            });

            addLog(`✅ API call successful: ${JSON.stringify(response.data)}`, 'success');
            setTestResults(prev => ({
                ...prev,
                apiCall: 'SUCCESS - Check logs for details'
            }));
        } catch (error) {
            addLog(`❌ API call failed: ${error.message}`, 'error');
            addLog(`📊 Error response: ${JSON.stringify(error.response?.data)}`, 'error');
            setTestResults(prev => ({
                ...prev,
                apiCall: `FAILED: ${error.message}`
            }));
        }
    };

    const testTokenValidation = async () => {
        addLog('🔑 Testing token validation...', 'info');
        setTestResults(prev => ({ ...prev, tokenValidation: 'testing...' }));

        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            addLog('❌ No token found in localStorage', 'error');
            setTestResults(prev => ({
                ...prev,
                tokenValidation: 'NO TOKEN'
            }));
            return;
        }

        try {
            const response = await api.get('/auth/me');
            addLog(`✅ Token validation successful: ${JSON.stringify(response.data)}`, 'success');
            setTestResults(prev => ({
                ...prev,
                tokenValidation: 'VALID'
            }));
        } catch (error) {
            addLog(`❌ Token validation failed: ${error.message}`, 'error');
            setTestResults(prev => ({
                ...prev,
                tokenValidation: `INVALID: ${error.message}`
            }));
        }
    };

    const clearLogs = () => {
        setLogs([]);
        setTestResults({});
    };

    const forceLogout = () => {
        addLog('🚪 Forcing logout...', 'info');
        logout();
        localStorage.clear();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        🔍 Authentication Debug Panel
                    </h1>
                    <p className="text-gray-600">
                        This panel helps debug authentication issues in the React app.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Current State */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">📊 Current Auth State</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="font-medium">Loading:</span>
                                <span className={loading ? 'text-yellow-600' : 'text-green-600'}>
                                    {loading ? '⏳ Yes' : '✅ No'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">User:</span>
                                <span className={user ? 'text-green-600' : 'text-red-600'}>
                                    {user ? `✅ ${user.firstName} ${user.lastName}` : '❌ None'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Role:</span>
                                <span className="text-blue-600">
                                    {user?.role || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Token:</span>
                                <span className={token ? 'text-green-600' : 'text-red-600'}>
                                    {token ? `✅ Present (${token.length} chars)` : '❌ None'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">LocalStorage Token:</span>
                                <span className={localStorage.getItem('token') ? 'text-green-600' : 'text-red-600'}>
                                    {localStorage.getItem('token') ? '✅ Present' : '❌ None'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Error:</span>
                                <span className={error ? 'text-red-600' : 'text-green-600'}>
                                    {error || '✅ None'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Test Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">🧪 Test Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={testDirectLogin}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                            >
                                🔐 Test React Login Function
                            </button>
                            <div className="text-sm text-gray-600">
                                Result: {testResults.directLogin || 'Not tested'}
                            </div>

                            <button
                                onClick={testAPICall}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                            >
                                📡 Test Direct API Call
                            </button>
                            <div className="text-sm text-gray-600">
                                Result: {testResults.apiCall || 'Not tested'}
                            </div>

                            <button
                                onClick={testTokenValidation}
                                className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
                            >
                                🔑 Test Token Validation
                            </button>
                            <div className="text-sm text-gray-600">
                                Result: {testResults.tokenValidation || 'Not tested'}
                            </div>

                            <button
                                onClick={forceLogout}
                                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                            >
                                🚪 Force Logout & Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Debug Logs */}
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">📝 Debug Logs</h2>
                        <button
                            onClick={clearLogs}
                            className="bg-gray-500 text-white py-1 px-3 rounded text-sm hover:bg-gray-600"
                        >
                            Clear Logs
                        </button>
                    </div>
                    <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
                        {logs.length === 0 ? (
                            <div className="text-gray-500">No logs yet...</div>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className={`mb-1 ${log.type === 'error' ? 'text-red-400' :
                                        log.type === 'success' ? 'text-green-400' :
                                            log.type === 'warning' ? 'text-yellow-400' :
                                                'text-blue-400'
                                    }`}>
                                    [{log.timestamp}] {log.message}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Navigation */}
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4">🧭 Quick Navigation</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <a href="/login" className="bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700">
                            Login Page
                        </a>
                        <a href="/admin" className="bg-red-600 text-white py-2 px-4 rounded text-center hover:bg-red-700">
                            Admin Dashboard
                        </a>
                        <a href="/debug-auth.html" target="_blank" className="bg-green-600 text-white py-2 px-4 rounded text-center hover:bg-green-700">
                            HTML Debug
                        </a>
                        <a href="/test-login.html" target="_blank" className="bg-purple-600 text-white py-2 px-4 rounded text-center hover:bg-purple-700">
                            Test Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebugAuth;