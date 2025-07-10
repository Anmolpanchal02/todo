import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, User, Mail, Lock, X, CheckCircle, AlertCircle } from 'lucide-react';

// Toast Component - Displays temporary notifications
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-[60] transform transition-all duration-300 animate-slide-in`}>
      <Icon size={20} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-1">
        <X size={16} />
      </button>
    </div>
  );
};

// Main Login/Signup Component
const App = ({ onClose, onAuthSuccess }) => { // Renamed to App for default export
  const [isLogin, setIsLogin] = useState(true); // Toggles between login and signup view
  const [auth, setAuth] = useState({ email: '', password: '', fullname: '' }); // Stores form input
  const [showPassword, setShowPassword] = useState(false); // Toggles password visibility
  const [isLoading, setIsLoading] = useState(false); // Manages loading state for buttons
  const [toast, setToast] = useState(null); // State for displaying toast messages

  // Function to show a toast message
  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000); // Hide toast after 4 seconds
  };

  // Handles authentication (Login or Signup)
  const handleAuth = async () => {
    // Input validation
    if (!auth.email || !auth.password || (!isLogin && !auth.fullname)) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      // Determine the API endpoint based on whether it's login or signup
      const url = `http://localhost:5000/api/auth/${isLogin ? 'login' : 'signup'}`;
      
      // Prepare the payload for the API request
      const payload = {
        email: auth.email,
        password: auth.password,
      };
      if (!isLogin) {
        payload.fullname = auth.fullname; // Add fullname only for signup requests
      }

      // Make the actual API call to your backend
      const res = await axios.post(url, payload);

      // Store the received JWT token in local storage
      localStorage.setItem('token', res.data.token);
      
      // Display success toast using message from backend if available, otherwise a default
      showToast(res.data.message || `${isLogin ? 'Login' : 'Account creation'} successful!`, 'success');

      // Delay calling onAuthSuccess and onClose to allow the user to see the toast
      setTimeout(() => {
        onAuthSuccess(res.data.token, isLogin); // Notify parent component of successful authentication
        onClose(); // Close the modal
      }, 1000);

    } catch (err) {
      // Handle API errors
      console.error("Authentication error:", err.response?.data || err.message);
      // Display error toast using message from backend if available, otherwise a default
      showToast(err.response?.data?.error || 'Authentication failed. Please try again.', 'error');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Handles 'Enter' key press to submit the form
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAuth();
    }
  };

  return (
    <>
      <div className='fixed inset-0 z-50  backdrop-blur-sm flex items-center justify-center p-4'>
        <div className='bg-white/95 backdrop-blur-xl w-full max-w-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-300 scale-100'>
          {/* Header with gradient */}
          <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative'>
            <button
              onClick={onClose}
              className='absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200'
            >
              <X size={20} />
            </button>
            <h2 className='text-2xl font-bold mb-2'>
              {isLogin ? 'Welcome Back!' : 'Join Us Today'}
            </h2>
            <p className='text-white/80 text-sm'>
              {isLogin ? 'Sign in to your account' : 'Create your new account'}
            </p>
          </div>

          {/* Form Content */}
          <div className='p-8'>
            <div className='space-y-6'>
              {!isLogin && (
                <div className='group'>
                  <label htmlFor="fullname" className='block text-sm font-medium text-gray-700 mb-2'>
                    Full Name
                  </label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors' size={20} />
                    <input
                      id="fullname"
                      type='text'
                      placeholder='Enter your full name'
                      value={auth.fullname}
                      onChange={(e) => setAuth({ ...auth, fullname: e.target.value })}
                      onKeyPress={handleKeyPress}
                      className='w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white'
                    />
                  </div>
                </div>
              )}

              <div className='group'>
                <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors' size={20} />
                  <input
                    id="email"
                    type='email'
                    placeholder='Enter your email'
                    value={auth.email}
                    onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                    onKeyPress={handleKeyPress}
                    className='w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white'
                  />
                </div>
              </div>

              <div className='group'>
                <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors' size={20} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={auth.password}
                    onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                    onKeyPress={handleKeyPress}
                    className='w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 focus:bg-white'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleAuth}
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>

              <div className='text-center'>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className='text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium'
                >
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <span className='text-blue-600 hover:underline'>
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default App; // Export as App for direct use in Canvas
