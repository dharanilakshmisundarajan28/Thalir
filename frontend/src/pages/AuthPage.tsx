import { useState } from 'react';
import { Sprout } from 'lucide-react';
import Login from '../components/Login';
import Register from '../components/Register';
import '../styles/AuthPage.css';

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <div className="auth-page-wrapper">
            <div className={`auth-container ${isSignUp ? 'right-panel-active' : ''}`}>
                {/* Sign Up Form */}
                <div className="form-container sign-up-container">
                    <div className="auth-form">
                        <h1>Create Account</h1>
                        <span className="auth-subtitle">Use your email for registration</span>
                        <Register />
                    </div>
                </div>

                {/* Sign In Form */}
                <div className="form-container sign-in-container">
                    <div className="auth-form">
                        <h1>Sign In</h1>
                        <span className="auth-subtitle">Use your credentials to login</span>
                        <Login />
                    </div>
                </div>

                {/* Overlay Container */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <div className="overlay-content">
                                <div className="logo-container">
                                    <Sprout size={48} />
                                </div>
                                <h1>Welcome Back!</h1>
                                <p>To keep connected with us please login with your personal info</p>
                                <button className="ghost-btn" onClick={() => setIsSignUp(false)}>
                                    Sign In
                                </button>
                            </div>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <div className="overlay-content">
                                <div className="logo-container">
                                    <Sprout size={48} />
                                </div>
                                <h1>Hello, Friend!</h1>
                                <p>Enter your personal details and start your journey with THALIR</p>
                                <button className="ghost-btn" onClick={() => setIsSignUp(true)}>
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
