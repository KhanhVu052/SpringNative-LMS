import React, { createContext, useState, useContext } from 'react';

// 1. Tạo Context
const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string>('');
  const [token, setToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  // Hàm đăng nhập thực tế kết nối tới backend
  const login = async (usernameOrEmail = '', password = '') => {
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail,
          password,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `Login response status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.token) {
        setToken(data.token);
        if (data.id) {
          setUserId(String(data.id));
        }
        console.log(`✅ Logged in successfully as: ${data.username} (ID: ${data.id})`);
        return data;
      }
    } catch (err: any) {
      console.warn('⚠️ Login failed:', err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, token, setToken, login, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Hook để sử dụng
export const useUser = () => useContext(UserContext);