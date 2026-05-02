"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '../../../components/Logo';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState<boolean>(true);
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [selectedLoginRole, setSelectedLoginRole] = useState<'user' | 'admin'>('user');
  const [loginRole, setLoginRole] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const resetFields = (): void => {
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('user');
    setSelectedLoginRole('user');
    setLoginRole('');
    setShowPassword(false);
    setError('');
    setSuccess('');
  };

  const showAlert = (message: string, isSuccess: boolean): void => {
    if (isSuccess) {
      setSuccess(message);
      setError('');
    } else {
      setError(message);
      setSuccess('');
    }
  };

  const validateEmail = (value: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateRegistration = (): boolean => {
    if (!name.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      showAlert('Please fill in all required fields.', false);
      return false;
    }

    if (!validateEmail(email.trim())) {
      showAlert('Please enter a valid email address.', false);
      return false;
    }

    if (password.length < 8) {
      showAlert('Password must be at least 8 characters long.', false);
      return false;
    }

    if (password !== confirmPassword) {
      showAlert('Passwords do not match.', false);
      return false;
    }

    return true;
  };

  const validateLogin = (): boolean => {
    if (!username.trim() || !password) {
      showAlert('Please enter both username and password.', false);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (isRegister && !validateRegistration()) {
      setLoading(false);
      return;
    }

    if (!isRegister && !validateLogin()) {
      setLoading(false);
      return;
    }

    try {
      const body = isRegister
        ? {
            name: name.trim(),
            username: username.trim(),
            email: email.trim(),
            password: password.trim(),
            role
          }
        : {
            username: username.trim(),
            password: password.trim(),
            role: selectedLoginRole
          };

      const endpoint = isRegister ? 'register' : 'login';

      const res = await fetch(`https://streetpaws-4.onrender.com/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        showAlert(errorData.message || `HTTP ${res.status}`, false);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (isRegister) {
        showAlert(data.message || 'Account created successfully! Please sign in.', true);

        setTimeout(() => {
          setIsRegister(false);
          setPassword('');
          setConfirmPassword('');
          setSuccess('');
        }, 2200);

        setLoading(false);
        return;
      }

      const token: string | undefined = data.access_token || data.token;

      if (!token) {
        showAlert(data.message || data.error || 'Invalid credentials.', false);
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);

      const userData = {
        username: data.user?.username || username.trim(),
        role: data.user?.role || 'User',
        user_id: data.user?.user_id || data.user?.id
      };

      localStorage.setItem('streetpaws_user', JSON.stringify(userData));
      setLoginRole(userData.role);
      showAlert(`Welcome ${userData.username}!`, true);

      setTimeout(() => {
        if (userData.role.toLowerCase().includes('admin')) {
          router.push('/admindashboard');
        } else {
          router.push('/userdashboard');
        }
      }, 1000);
    } catch {
      showAlert('Network error. Please try again later.', false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col">

      {/* CENTER CONTENT */}
      <div className="flex flex-1 items-center justify-center p-4">

        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-3xl p-10 lg:p-12 space-y-8 border border-emerald-100/50">

          {/* HEADER */}
          <Link href="/" className="hover:scale-105 transition-all duration-500">
            <Logo showText={true} size="md" />
          </Link>

          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl mx-auto mb-8 flex items-center justify-center text-4xl animate-[glow_3s_ease-in-out_infinite] border-4 border-white/50 shadow-2xl">
              🐾
            </div>

<h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-800 via-gray-700 to-emerald-800 bg-clip-text text-transparent drop-shadow-2xl">
              Street Paws Naga
            </h1>

<p className="text-lg md:text-xl text-emerald-500 font-bold drop-shadow-lg">
              {isRegister ? 'Create your Street Paws account' : 'Sign in and see your role immediately'}
            </p>
          </div>

          {isRegister ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6 p-6 bg-emerald-50 rounded-3xl border-4 border-white/30 shadow-xl">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`group p-8 rounded-3xl shadow-2xl border-4 transition-all duration-500 hover:-translate-y-2 hover:scale-105 ${
                    role === 'user'
                      ? 'bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border-blue-300 shadow-blue-300/50'
                      : 'bg-white/80 hover:border-emerald-300'
                  }`}
                >
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    {role === 'user' ? '🐕' : '👤'}
                  </div>
                  <h3 className="text-2xl font-black">Community User</h3>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`group p-8 rounded-3xl shadow-2xl border-4 transition-all duration-500 hover:-translate-y-2 hover:scale-105 ${
                    role === 'admin'
                      ? 'bg-gradient-to-br from-orange-400/20 to-amber-400/20 border-orange-300 shadow-orange-300/50'
                      : 'bg-white/80 hover:border-emerald-300'
                  }`}
                >
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    {role === 'admin' ? '👨‍💼' : '🔧'}
                  </div>
                  <h3 className="text-2xl font-black">Admin/Staff</h3>
                </button>
              </div>
              <p className="text-center text-sm text-gray-600">
                Choose your account type for registration. This cannot be changed later.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-3xl p-6 bg-emerald-50 border-4 border-white/30 shadow-xl text-center text-sm text-emerald-700">
                Choose how you want to sign in. This helps make your dashboard path clear.
              </div>
              <div className="grid md:grid-cols-2 gap-6 p-6 bg-white rounded-3xl border-4 border-emerald-100 shadow-xl">
                <button
                  type="button"
                  onClick={() => setSelectedLoginRole('user')}
                  className={`group p-6 rounded-3xl shadow-2xl border-4 transition-all duration-500 hover:-translate-y-2 hover:scale-105 ${
                    selectedLoginRole === 'user'
                      ? 'bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border-blue-300 shadow-blue-300/50'
                      : 'bg-white/80 hover:border-emerald-300'
                  }`}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">
                    {selectedLoginRole === 'user' ? '🐕' : '👤'}
                  </div>
                  <h3 className="text-2xl font-black">Sign in as User</h3>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLoginRole('admin')}
                  className={`group p-6 rounded-3xl shadow-2xl border-4 transition-all duration-500 hover:-translate-y-2 hover:scale-105 ${
                    selectedLoginRole === 'admin'
                      ? 'bg-gradient-to-br from-orange-400/20 to-amber-400/20 border-orange-300 shadow-orange-300/50'
                      : 'bg-white/80 hover:border-emerald-300'
                  }`}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">
                    {selectedLoginRole === 'admin' ? '👨‍💼' : '🔧'}
                  </div>
                  <h3 className="text-2xl font-black">Sign in as Admin</h3>
                </button>
              </div>
            </div>
          )}

          {/* TOGGLE */}
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-2xl shadow-inner">

            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setLoginRole('');
                setSuccess('');
                setError('');
              }}
              className={`py-4 rounded-xl font-bold transition-all ${
                !isRegister
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-white'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`py-4 rounded-xl font-bold transition-all ${
                isRegister
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-white'
              }`}
            >
              Sign Up
            </button>

          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 transition-all shadow-xl"
              placeholder="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {isRegister && (
              <input
                className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 transition-all shadow-xl"
                placeholder="Full Name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            {isRegister && (
              <input
                className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 transition-all shadow-xl"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}

            <input
              className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 transition-all shadow-xl"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <input
                id="showPassword"
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
              <label htmlFor="showPassword" className="cursor-pointer">
                Show password
              </label>
            </div>

            {isRegister && (
              <input
                className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 transition-all shadow-xl"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}
            {!isRegister && loginRole && (
              <div className={`rounded-2xl p-6 border-4 shadow-xl text-center transition-all duration-500 ${
                loginRole.toLowerCase().includes('admin')
                  ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300'
                  : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300'
              }`}>
                <div className="text-6xl mb-4 animate-bounce">
                  {loginRole.toLowerCase().includes('admin') ? '👨‍💼' : '🐕'}
                </div>
                <h3 className="text-2xl font-black mb-2">
                  {loginRole.toLowerCase().includes('admin') ? 'Admin/Staff Account' : 'Community User Account'}
                </h3>
                <p className="text-lg text-gray-700">
                  You are signed in as <strong className="text-emerald-700">{loginRole}</strong>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Redirecting to your dashboard...
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all"
            >
              {loading ? 'Loading...' : isRegister ? 'Create Account' : 'Login'}
            </button>

</form>

          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 px-8 rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-gray-600 hover:to-gray-700 transition-all hover:scale-105 transform text-center"
          >
            ← Back to Home
          </Link>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full bg-white/95 border-t py-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center">

          <Logo showText size="lg" />

          <a
            href="https://www.facebook.com/profile.php?id=61556021032482"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-3xl shadow-xl hover:scale-105 transition-all"
          >
            Follow us on Facebook
          </a>

          <p className="text-gray-600">
            © 2026 Street Paws Naga. Every paw deserves a home ❤️
          </p>

        </div>
      </footer>

    </div>
  );
}
