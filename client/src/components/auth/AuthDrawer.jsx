import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Check, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthDrawer = () => {
  const {
    isAuthDrawerOpen,
    closeAuthDrawer,
    authView,
    switchAuthView,
    signIn,
    signUp,
  } = useAuth();

  // Form states - Sign In
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Form states - Sign Up
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states - Forgot Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Status & Validation
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Reset errors when view changes or drawer opens/closes
  useEffect(() => {
    setErrors({});
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(false);
    setForgotSuccess(false);
  }, [authView, isAuthDrawerOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthDrawerOpen) {
        closeAuthDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthDrawerOpen, closeAuthDrawer]);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isAuthDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAuthDrawerOpen]);

  if (!isAuthDrawerOpen) return null;

  // Email format regex
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle Sign In Submit
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setAuthError('');
    setAuthSuccess('');

    const newErrors = {};
    if (!signInEmail.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmail(signInEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!signInPassword) {
      newErrors.password = 'Password is required.';
    } else if (signInPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await signIn(signInEmail, signInPassword);
      setAuthSuccess('Welcome back! Authenticating account...');
      setTimeout(() => {
        closeAuthDrawer();
        // Reset form
        setSignInPassword('');
      }, 700);
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setAuthError('');
    setAuthSuccess('');

    const newErrors = {};
    if (!signUpName.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!signUpEmail.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmail(signUpEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!signUpPassword) {
      newErrors.password = 'Password is required.';
    } else if (signUpPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!signUpConfirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (signUpPassword !== signUpConfirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must agree to the Terms & Conditions.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await signUp(signUpName, signUpEmail, signUpPassword);
      setAuthSuccess('Account created successfully! Welcome to ASN Media.');
      setTimeout(() => {
        closeAuthDrawer();
        // Reset form
        setSignUpName('');
        setSignUpEmail('');
        setSignUpPassword('');
        setSignUpConfirmPassword('');
        setAcceptTerms(false);
      }, 800);
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setAuthError('');

    if (!forgotEmail.trim()) {
      setErrors({ email: 'Email address is required.' });
      return;
    } else if (!validateEmail(forgotEmail)) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    }

    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsLoading(false);
    setForgotSuccess(true);
  };

  // Mock Google Sign-In handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError('');
    try {
      await signIn('google.user@asnmedia.in', 'googleMockPass123');
      setAuthSuccess('Signed in with Google successfully!');
      setTimeout(() => {
        closeAuthDrawer();
      }, 750);
    } catch (err) {
      setAuthError('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden animate-fadeIn">
      {/* Full-screen Backdrop with Blur & Dimming */}
      <div
        className="fixed inset-0 bg-[#0A0A0A]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeAuthDrawer}
        aria-hidden="true"
      />

      {/* Slide-In Authentication Panel */}
      <aside
        className="relative w-full sm:w-[480px] md:w-[500px] h-full bg-[#F7F5EF] text-[#0A0A0A] shadow-2xl flex flex-col border-l border-[#0A0A0A]/10 z-10 animate-slideInRight overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-heading"
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-[#F7F5EF]/90 backdrop-blur-md px-8 py-6 border-b border-[#0A0A0A]/08 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#C8A13A] animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] font-semibold text-[#0A0A0A]/70 uppercase font-body">
              ASN MEDIA CLIENT PORTAL
            </span>
          </div>

          <button
            onClick={closeAuthDrawer}
            className="group p-2 -mr-2 rounded-full hover:bg-[#0A0A0A]/05 text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-all duration-200 focus:outline-none"
            aria-label="Close authentication panel"
          >
            <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 px-8 py-8 sm:px-10 flex flex-col justify-between">
          {/* Main Auth Content Area */}
          <div>
            {/* Global Error Banner */}
            {authError && (
              <div className="mb-6 p-4 rounded-[4px] bg-red-50 border border-red-200/80 text-red-900 text-xs flex items-start gap-3 animate-fadeIn font-body">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{authError}</div>
              </div>
            )}

            {/* Global Success Banner */}
            {authSuccess && (
              <div className="mb-6 p-4 rounded-[4px] bg-[#C8A13A]/15 border border-[#C8A13A]/40 text-[#0A0A0A] text-xs flex items-start gap-3 animate-fadeIn font-body">
                <Check className="w-4 h-4 text-[#8E722A] shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed font-medium">{authSuccess}</div>
              </div>
            )}

            {/* SIGN IN VIEW */}
            {authView === 'signin' && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <span className="text-[10px] tracking-[0.25em] font-semibold text-[#C8A13A] uppercase font-body block mb-1.5">
                    ACCOUNT ACCESS
                  </span>
                  <h2
                    id="auth-heading"
                    className="font-display text-4xl sm:text-5xl text-[#0A0A0A] font-normal leading-tight"
                  >
                    Welcome Back
                  </h2>
                  <p className="text-xs text-[#66615A] font-body mt-2">
                    Access your campaign intelligence, deliverables & client portal.
                  </p>
                </div>

                <form onSubmit={handleSignInSubmit} noValidate className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider text-[#0A0A0A] uppercase font-body mb-2">
                      Email Address <span className="text-[#C8A13A]">*</span>
                    </label>
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => {
                        setSignInEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                      }}
                      placeholder="alex@asnmedia.in"
                      disabled={isLoading}
                      className={`w-full px-4 py-3 bg-white text-[#0A0A0A] text-sm font-body rounded-[3px] border transition-all duration-200 focus:outline-none placeholder:text-[#0A0A0A]/30 ${
                        errors.email
                          ? 'border-red-500 ring-1 ring-red-500/20'
                          : 'border-[#0A0A0A]/15 focus:border-[#C8A13A] focus:ring-1 focus:ring-[#C8A13A]/30'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-[11px] text-red-600 font-body flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[11px] font-semibold tracking-wider text-[#0A0A0A] uppercase font-body">
                        Password <span className="text-[#C8A13A]">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => switchAuthView('forgot')}
                        className="text-[11px] text-[#66615A] hover:text-[#C8A13A] transition-colors font-body underline underline-offset-4 focus:outline-none"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => {
                          setSignInPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                        }}
                        placeholder="••••••••••••"
                        disabled={isLoading}
                        className={`w-full pl-4 pr-11 py-3 bg-white text-[#0A0A0A] text-sm font-body rounded-[3px] border transition-all duration-200 focus:outline-none placeholder:text-[#0A0A0A]/30 ${
                          errors.password
                            ? 'border-red-500 ring-1 ring-red-500/20'
                            : 'border-[#0A0A0A]/15 focus:border-[#C8A13A] focus:ring-1 focus:ring-[#C8A13A]/30'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors p-1"
                        aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignInPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1.5 text-[11px] text-red-600 font-body flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={rememberMe}
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-all focus:outline-none ${
                        rememberMe
                          ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white'
                          : 'border-[#0A0A0A]/30 bg-white hover:border-[#0A0A0A]/60'
                      }`}
                    >
                      {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <span
                      onClick={() => setRememberMe(!rememberMe)}
                      className="text-xs text-[#0A0A0A]/80 font-body cursor-pointer select-none"
                    >
                      Keep me signed in on this device
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 py-4 bg-[#0A0A0A] text-[#F7F5EF] hover:bg-[#C8A13A] hover:text-[#0A0A0A] transition-all duration-300 font-semibold tracking-[0.18em] text-xs uppercase rounded-[3px] shadow-sm flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-current" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>SIGN IN</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Subtle Divider */}
                <div className="relative my-7 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#0A0A0A]/10" />
                  </div>
                  <span className="relative bg-[#F7F5EF] px-4 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#66615A] font-body">
                    OR
                  </span>
                </div>

                {/* Optional Social Sign-In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-white hover:bg-white/80 border border-[#0A0A0A]/15 hover:border-[#0A0A0A]/30 text-[#0A0A0A] font-body font-semibold text-xs tracking-wider uppercase rounded-[3px] transition-all duration-200 flex items-center justify-center gap-3 focus:outline-none shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Helper hint box */}
                <div className="mt-6 p-3 bg-white/60 border border-[#0A0A0A]/08 rounded-[3px] text-[11px] text-[#66615A] font-body">
                  <span className="font-semibold text-[#0A0A0A]">Demo Access Note:</span> Enter any valid email to test instant sign in, or enter <code className="text-[#8E722A] bg-amber-50 px-1 py-0.5 rounded">error@asnmedia.in</code> to test error handling.
                </div>
              </div>
            )}

            {/* SIGN UP VIEW */}
            {authView === 'signup' && (
              <div className="animate-fadeIn">
                <div className="mb-6">
                  <span className="text-[10px] tracking-[0.25em] font-semibold text-[#C8A13A] uppercase font-body block mb-1.5">
                    JOIN ASN MEDIA
                  </span>
                  <h2
                    id="auth-heading"
                    className="font-display text-4xl sm:text-5xl text-[#0A0A0A] font-normal leading-tight"
                  >
                    Create Your Account
                  </h2>
                  <p className="text-xs text-[#66615A] font-body mt-2">
                    Partner with ASN Media for elevated social strategy & creative growth.
                  </p>
                </div>

                <form onSubmit={handleSignUpSubmit} noValidate className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider text-[#0A0A0A] uppercase font-body mb-1.5">
                      Full Name <span className="text-[#C8A13A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={signUpName}
                      onChange={(e) => {
                        setSignUpName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                      }}
                      placeholder="Alex Morgan"
                      disabled={isLoading}
                      className={`w-full px-4 py-2.5 bg-white text-[#0A0A0A] text-sm font-body rounded-[3px] border transition-all duration-200 focus:outline-none placeholder:text-[#0A0A0A]/30 ${
                        errors.name
                          ? 'border-red-500 ring-1 ring-red-500/20'
                          : 'border-[#0A0A0A]/15 focus:border-[#C8A13A] focus:ring-1 focus:ring-[#C8A13A]/30'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-[11px] text-red-600 font-body flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider text-[#0A0A0A] uppercase font-body mb-1.5">
                      Email Address <span className="text-[#C8A13A]">*</span>
                    </label>
                    <input
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => {
                        setSignUpEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                      }}
                      placeholder="alex@asnmedia.in"
                      disabled={isLoading}
                      className={`w-full px-4 py-2.5 bg-white text-[#0A0A0A] text-sm font-body rounded-[3px] border transition-all duration-200 focus:outline-none placeholder:text-[#0A0A0A]/30 ${
                        errors.email
                          ? 'border-red-500 ring-1 ring-red-500/20'
                          : 'border-[#0A0A0A]/15 focus:border-[#C8A13A] focus:ring-1 focus:ring-[#C8A13A]/30'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-[11px] text-red-600 font-body flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider text-[#0A0A0A] uppercase font-body mb-1.5">
                      Password <span className="text-[#C8A13A]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={signUpPassword}
                        onChange={(e) => {
                          setSignUpPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                        }}
                        placeholder="At least 6 characters"
                        disabled={isLoading}
                        className={`w-full pl-4 pr-11 py-2.5 bg-white text-[#0A0A0A] text-sm font-body rounded-[3px] border transition-all duration-200 focus:outline-none placeholder:text-[#0A0A0A]/30 ${
                          errors.password
                            ? 'border-red-500 ring-1 ring-red-500/20'
                            : 'border-[#0A0A0A]/15 focus:border-[#C8A13A] focus:ring-1 focus:ring-[#C8A13A]/30'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors p-1"
                      >
                        {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-[11px] text-red-600 font-body flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider text-[#0A0A0A] uppercase font-body mb-1.5">
                      Confirm Password <span className="text-[#C8A13A]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signUpConfirmPassword}
                        onChange={(e) => {
                          setSignUpConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                        }}
                        placeholder="Re-enter your password"
                        disabled={isLoading}
                        className={`w-full pl-4 pr-11 py-2.5 bg-white text-[#0A0A0A] text-sm font-body rounded-[3px] border transition-all duration-200 focus:outline-none placeholder:text-[#0A0A0A]/30 ${
                          errors.confirmPassword
                            ? 'border-red-500 ring-1 ring-red-500/20'
                            : 'border-[#0A0A0A]/15 focus:border-[#C8A13A] focus:ring-1 focus:ring-[#C8A13A]/30'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors p-1"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-[11px] text-red-600 font-body flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="pt-1">
                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={acceptTerms}
                        onClick={() => {
                          setAcceptTerms(!acceptTerms);
                          if (errors.terms) setErrors((prev) => ({ ...prev, terms: null }));
                        }}
                        className={`w-4 h-4 mt-0.5 rounded-[2px] border flex items-center justify-center transition-all focus:outline-none shrink-0 ${
                          acceptTerms
                            ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white'
                            : errors.terms
                            ? 'border-red-500 bg-red-50'
                            : 'border-[#0A0A0A]/30 bg-white hover:border-[#0A0A0A]/60'
                        }`}
                      >
                        {acceptTerms && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <span
                        onClick={() => {
                          setAcceptTerms(!acceptTerms);
                          if (errors.terms) setErrors((prev) => ({ ...prev, terms: null }));
                        }}
                        className="text-xs text-[#0A0A0A]/80 font-body leading-relaxed cursor-pointer select-none"
                      >
                        I agree to the{' '}
                        <a href="/terms" target="_blank" className="text-[#0A0A0A] font-semibold underline underline-offset-2 hover:text-[#C8A13A]">
                          Terms & Conditions
                        </a>{' '}
                        and Privacy Policy of ASN Media.
                      </span>
                    </div>
                    {errors.terms && (
                      <p className="mt-1 text-[11px] text-red-600 font-body flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.terms}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-5 py-4 bg-[#0A0A0A] text-[#F7F5EF] hover:bg-[#C8A13A] hover:text-[#0A0A0A] transition-all duration-300 font-semibold tracking-[0.18em] text-xs uppercase rounded-[3px] shadow-sm flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-current" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>CREATE ACCOUNT</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* FORGOT PASSWORD VIEW */}
            {authView === 'forgot' && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <span className="text-[10px] tracking-[0.25em] font-semibold text-[#C8A13A] uppercase font-body block mb-1.5">
                    PASSWORD RECOVERY
                  </span>
                  <h2 className="font-display text-4xl sm:text-5xl text-[#0A0A0A] font-normal leading-tight">
                    Reset Password
                  </h2>
                  <p className="text-xs text-[#66615A] font-body mt-2 leading-relaxed">
                    Enter your registered email address and we'll send you instructions to reset your client portal password.
                  </p>
                </div>

                {forgotSuccess ? (
                  <div className="p-6 bg-white border border-[#C8A13A]/30 rounded-[4px] space-y-4 animate-fadeIn">
                    <div className="w-10 h-10 rounded-full bg-[#C8A13A]/15 flex items-center justify-center text-[#8E722A]">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0A0A0A] font-body">Reset Link Sent</h3>
                      <p className="text-xs text-[#66615A] font-body mt-1 leading-relaxed">
                        We have sent password recovery instructions to <strong className="text-[#0A0A0A]">{forgotEmail}</strong>. Please check your inbox.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => switchAuthView('signin')}
                      className="w-full py-3 bg-[#0A0A0A] text-[#F7F5EF] hover:bg-[#C8A13A] hover:text-[#0A0A0A] font-semibold tracking-widest text-xs uppercase rounded-[3px] transition-colors"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} noValidate className="space-y-5">
                    <div>
                      <label className="block text-[11px] font-semibold tracking-wider text-[#0A0A0A] uppercase font-body mb-2">
                        Email Address <span className="text-[#C8A13A]">*</span>
                      </label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          if (errors.email) setErrors({});
                        }}
                        placeholder="alex@asnmedia.in"
                        disabled={isLoading}
                        className={`w-full px-4 py-3 bg-white text-[#0A0A0A] text-sm font-body rounded-[3px] border transition-all duration-200 focus:outline-none ${
                          errors.email
                            ? 'border-red-500'
                            : 'border-[#0A0A0A]/15 focus:border-[#C8A13A]'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-[11px] text-red-600 font-body flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-[#0A0A0A] text-[#F7F5EF] hover:bg-[#C8A13A] hover:text-[#0A0A0A] font-semibold tracking-widest text-xs uppercase rounded-[3px] transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Instructions...</span>
                        </>
                      ) : (
                        <span>SEND RESET LINK</span>
                      )}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => switchAuthView('signin')}
                        className="text-xs text-[#66615A] hover:text-[#0A0A0A] font-body underline underline-offset-4"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Bottom Switcher Footer */}
          <div className="pt-8 mt-8 border-t border-[#0A0A0A]/10 text-center">
            {authView === 'signin' && (
              <p className="text-xs text-[#66615A] font-body">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchAuthView('signup')}
                  className="font-semibold text-[#0A0A0A] hover:text-[#C8A13A] transition-colors underline underline-offset-4 ml-1 focus:outline-none"
                >
                  Create Account
                </button>
              </p>
            )}

            {authView === 'signup' && (
              <p className="text-xs text-[#66615A] font-body">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchAuthView('signin')}
                  className="font-semibold text-[#0A0A0A] hover:text-[#C8A13A] transition-colors underline underline-offset-4 ml-1 focus:outline-none"
                >
                  Sign In
                </button>
              </p>
            )}

            {authView === 'forgot' && (
              <p className="text-xs text-[#66615A] font-body">
                Need further assistance?{' '}
                <a href="/contact" className="font-semibold text-[#0A0A0A] hover:text-[#C8A13A] underline underline-offset-4 ml-1">
                  Contact Support
                </a>
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};
