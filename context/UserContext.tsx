import React, { createContext, useState, useContext } from 'react';

// 1. Tạo Context
const UserContext = createContext<any>(null);

const MOCK_TOKEN = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtcmtoYW5oX2phdmEzIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc3OTYzMzcyMywiZXhwIjoxNzc5NzIwMTIzfQ.MMWeKH-UJ9TVMWLn8ArYjPNmz3e4HG5y1XEXxeJZnx9EN9-AYxrQIOyM1Vl0sl6O';

// 2. Tạo Provider
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // GIẢ LẬP ĐĂNG NHẬP Ở ĐÂY: Thay null/'' bằng ID bạn lấy từ Postman (ví dụ: '1')
  const [userId, setUserId] = useState('4');
  const [token] = useState(MOCK_TOKEN);

  return (
    <UserContext.Provider value={{ userId, setUserId, token }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Hook để sử dụng
export const useUser = () => useContext(UserContext);