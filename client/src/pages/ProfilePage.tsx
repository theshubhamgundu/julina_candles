import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { userNotExists } from '../redux/reducers/user.reducer';
import { RootState } from '../redux/store';
import { notify } from '../utils/util';
import { supabase } from '../supabaseConfig';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = async () => {
    localStorage.removeItem('user');
    await supabase.auth.signOut();
    dispatch(userNotExists());
    notify('Logged out successfully', 'info');
  };

  const getInitial = (name?: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f6f1e7] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-md mb-4">
        <BackButton />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#ede3cf] max-w-md w-full text-center">
        {user ? (
          <div>
            {/* Avatar Circle with Initial or Photo */}
            <div className="flex justify-center mb-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name || 'User Profile'}
                  className="h-24 w-24 rounded-full object-cover shadow-md border-2 border-[#185e33]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-[#185e33] text-white text-3xl font-bold flex items-center justify-center shadow-md">
                  {getInitial(user.name)}
                </div>
              )}
            </div>

            {/* User Info */}
            <h1 className="text-2xl font-bold text-[#185e33] mb-1 font-serif">
              {user.name || 'Julina Candles & Melts Customer'}
            </h1>
            <p className="text-gray-500 text-sm mb-6 font-medium">{user.email}</p>

            {/* Quick Action Buttons */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <Link
                to="/my-orders"
                className="w-full bg-[#faf6ee] hover:bg-[#ede3cf] text-[#185e33] font-bold py-3 px-4 rounded-xl text-sm transition-colors border border-[#ede3cf] flex items-center justify-center gap-2"
              >
                📦 View My Orders
              </Link>

              <button
                onClick={handleLogout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl text-sm transition-colors border border-red-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6">
            <p className="text-gray-600 text-sm mb-4">You are not logged in.</p>
            <Link
              to="/auth"
              className="inline-block bg-[#185e33] text-white font-bold py-2.5 px-6 rounded-full text-sm hover:bg-[#134b28] transition-colors shadow-md"
            >
              Sign In to Your Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

