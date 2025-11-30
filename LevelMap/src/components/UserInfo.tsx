import React, { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserInfoProps {
  onLogout: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ onLogout }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    // Get user info from localStorage
    const storedUsername = localStorage.getItem('username') || 'Player';
    const storedEmail = localStorage.getItem('userEmail') || '';
    setUsername(storedUsername);
    setEmail(storedEmail);
  }, []);

  return (
    <motion.div
      className="flex items-center gap-4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 backdrop-blur-sm"
        style={{
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
        }}
      >
        <User size={18} className="text-white" />
        <div className="text-white">
          <div className="font-bold text-sm">{username}</div>
          {email && <div className="text-xs opacity-80">{email}</div>}
        </div>
      </div>
      
      <button
        onClick={onLogout}
        className="p-3 rounded-xl border-2 backdrop-blur-sm transition hover:bg-red-500/20"
        style={{
          borderColor: '#ff6b35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
        }}
        aria-label="Logout"
        title="Logout"
      >
        <LogOut size={18} className="text-white" />
      </button>
    </motion.div>
  );
};

export default UserInfo;

