import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Tạo Context
const UserContext = createContext<any>(null);

export const resolveUserRole = (data: any) => {
  if (!data) return 'ROLE_STUDENT';
  const roleVal = data.role || data.roleName || '';
  if (roleVal) return roleVal;
  
  const username = (data.username || '').toLowerCase();
  const email = (data.email || '').toLowerCase();
  
  if (username === 'admin' || email.includes('admin')) {
    return 'ROLE_ADMIN';
  }
  if (username.includes('teacher') || username.includes('instructor') || email.includes('teacher') || email.includes('instructor')) {
    return 'ROLE_TEACHER';
  }
  return 'ROLE_STUDENT';
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string>('');
  const [token, setToken] = useState<string | undefined>();
  const [role, setRole] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Auto-resolve user details/role when token or userId changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token || !userId) return;
      try {
        const response = await fetch(`http://10.0.2.2:8080/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const userRole = resolveUserRole(data);
          setRole(userRole);
          console.log(`👤 Automatically resolved user role: ${userRole}`);
        }
      } catch (err: any) {
        console.warn('⚠️ Failed to auto-resolve user role:', err.message);
      }
    };
    fetchUserProfile();
  }, [token, userId]);

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
        
        // Immediate role assignment from login payload or custom admin check
        const resolvedRole = resolveUserRole(data);
        setRole(resolvedRole);
        
        console.log(`✅ Logged in successfully as: ${data.username} (ID: ${data.id}, Role: ${resolvedRole})`);
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
    <UserContext.Provider value={{ userId, setUserId, token, setToken, role, setRole, login, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Hook để sử dụng
export const useUser = () => useContext(UserContext);