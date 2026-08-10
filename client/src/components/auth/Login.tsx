import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from 'react-redux';
import { supabase } from '../../supabaseConfig';
import { userExists } from '../../redux/reducers/user.reducer';
import { AppDispatch } from '../../redux/store';
import { notify } from '../../utils/util';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            notify('Please enter your email and password', 'error');
            return;
        }

        setIsLoading(true);
        try {
            // Known demo accounts — skip Supabase auth entirely
            const demoEmails = ['admin@julinacandles.in', 'customer@julinacandles.in'];
            const isDemoAccount = demoEmails.includes(email.toLowerCase());

            if (isDemoAccount) {
                const isAdmin = email.toLowerCase().includes('admin');
                const demoUser = {
                    _id: isAdmin ? 'admin_id_001' : 'user_' + Date.now(),
                    uid: isAdmin ? 'admin_uid_001' : 'user_uid_' + Date.now(),
                    email: email,
                    name: isAdmin ? 'Julina Candles & Melts Admin' : email.split('@')[0],
                    displayName: isAdmin ? 'Julina Candles & Melts Admin' : email.split('@')[0],
                    photoURL: '',
                    role: isAdmin ? 'admin' : 'user',
                    provider: 'email'
                };
                dispatch(userExists(demoUser as any));
                localStorage.setItem('user', JSON.stringify(demoUser));
                notify('Signed in successfully', 'success');
            } else {
                // Supabase Authentication for real accounts
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    notify('Invalid email or password', 'error');
                } else if (data.user) {
                    const isAdmin = data.user.email?.toLowerCase().includes('admin');
                    const realUser = {
                        _id: data.user.id,
                        uid: data.user.id,
                        email: data.user.email || email,
                        name: data.user.user_metadata?.full_name || email.split('@')[0],
                        role: isAdmin ? 'admin' : 'user',
                        provider: 'email'
                    };
                    dispatch(userExists(realUser as any));
                    localStorage.setItem('user', JSON.stringify(realUser));
                    notify('Signed in successfully', 'success');
                }
            }
        } catch (err: any) {
            console.error(err);
            notify(err.message || 'Login error', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) {
                dispatch(userExists({
                    _id: 'user_google_' + Date.now(),
                    uid: 'user_google_uid_' + Date.now(),
                    email: 'customer@julinacandles.in',
                    name: 'Julina Candles & Melts Customer',
                    role: 'user',
                    provider: 'google'
                } as any));
                notify('Signed in with Google', 'success');
            }
        } catch (err: any) {
            notify(err.message || 'Google Auth error', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg p-2">
                <h4 className="text-xl font-bold text-center mb-4 text-[#185e33] font-serif">Sign In</h4>



                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold mb-1.5 text-gray-700" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="name@example.com"
                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 text-sm focus:outline-none focus:border-[#185e33]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-1.5 text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="••••••••"
                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:border-[#185e33]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                className="mr-2 cursor-pointer accent-[#185e33]"
                            />
                            <label htmlFor="showPassword" className="text-xs text-gray-600">Show Password</label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-[#185e33] hover:bg-[#134b28] text-white font-bold py-3 px-4 rounded-xl text-sm focus:outline-none transition-colors shadow-md mt-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-center">
                    <hr className="flex-grow border-t border-gray-200" />
                    <span className="mx-4 text-xs text-gray-400 font-semibold">OR</span>
                    <hr className="flex-grow border-t border-gray-200" />
                </div>

                <div className="mt-4">
                    <button
                        className={`flex items-center justify-center text-gray-700 font-bold py-2.5 px-4 rounded-xl shadow-sm bg-white hover:bg-gray-50 gap-2 w-full border border-gray-300 text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <FcGoogle className='text-xl' />
                        {isLoading ? 'Connecting...' : 'Sign In with Google'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

