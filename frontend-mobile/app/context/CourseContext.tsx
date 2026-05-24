import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CourseContext = createContext<any>(null);

const initialRecommended = [
  { id: 'r1', title: 'Basic English for Class XIII', author: 'By Sarah Johnson', type: 'free', icon: '👨‍🎓', color: '#3B82F6', price: 'Free', likes: '2.3k' },
  { id: 'r2', title: 'Basic Physics', author: 'By Albert E.', type: 'free', icon: '⚛️', color: '#10B981', price: 'Free', likes: '1.5k' },
  { id: 'r3', title: 'Basic Chemistry', author: 'By Marie C.', type: 'free', icon: '🧪', color: '#F43F5E', price: 'Free', likes: '1.2k' },
  { id: 'r4', title: 'Html Course', author: 'By Tim B.', type: 'free', icon: '🌐', color: '#F97316', price: 'Free', likes: '3.1k' },
  { id: 'r5', title: 'Data Structures', author: 'By Ada L.', type: 'free', icon: '🧱', color: '#8B5CF6', price: 'Free', likes: '4.5k' },
  { id: 'r6', title: 'Intro to Philosophy', author: 'By Socrates', type: 'free', icon: '🏛️', color: '#06B6D4', price: 'Free', likes: '800' },
  { id: 'r7', title: 'World History', author: 'By H. G. Wells', type: 'free', icon: '🌍', color: '#64748B', price: 'Free', likes: '1.1k' },
  { id: 'r8', title: 'Basic Biology', author: 'By Charles D.', type: 'free', icon: '🧬', color: '#84CC16', price: 'Free', likes: '2.0k' },
  { id: 'r9', title: 'Creative Writing', author: 'By J.K.R.', type: 'free', icon: '✍️', color: '#EC4899', price: 'Free', likes: '3.8k' },
  { id: 'r10', title: 'Mental Math', author: 'By Ramanujan', type: 'free', icon: '🧮', color: '#EAB308', price: 'Free', likes: '5.6k' },
];

const initialPremium = [
  { id: 'p1', title: 'Ready for class XIII', author: 'By Ranbir Kumar', type: 'paid', icon: '👩‍🏫', color: '#F97316', price: '$7/Mo', likes: '3.5k' },
  { id: 'p2', title: 'UI/UX Design Course', author: 'By Design Master', type: 'paid', icon: '🎨', color: '#8B5CF6', price: '$15/Mo', likes: '4.2k' },
  { id: 'p3', title: 'Business Analysis', author: 'By John Doe', type: 'paid', icon: '📊', color: '#06B6D4', price: '$12/Mo', likes: '2.8k' },
  { id: 'p4', title: 'Javascript Mastery', author: 'By Brendan E.', type: 'paid', icon: '💻', color: '#EAB308', price: '$10/Mo', likes: '5.1k' },
  { id: 'p5', title: 'Machine Learning', author: 'By Alan T.', type: 'paid', icon: '🤖', color: '#10B981', price: '$20/Mo', likes: '6.2k' },
  { id: 'p6', title: 'Digital Marketing', author: 'By Neil P.', type: 'paid', icon: '📈', color: '#F43F5E', price: '$8/Mo', likes: '3.4k' },
  { id: 'p7', title: 'Fullstack React', author: 'By Dan A.', type: 'paid', icon: '⚛️', color: '#3B82F6', price: '$18/Mo', likes: '7.0k' },
  { id: 'p8', title: 'Advanced Finance', author: 'By Warren B.', type: 'paid', icon: '💰', color: '#14B8A6', price: '$25/Mo', likes: '8.9k' },
  { id: 'p9', title: 'Photography Pro', author: 'By Ansel A.', type: 'paid', icon: '📷', color: '#6366F1', price: '$10/Mo', likes: '4.1k' },
  { id: 'p10', title: 'Public Speaking', author: 'By Toastmasters', type: 'paid', icon: '🎤', color: '#D946EF', price: '$5/Mo', likes: '2.2k' },
];

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const [enrolled, setEnrolled] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>(initialRecommended);
  const [premium, setPremium] = useState<any[]>(initialPremium);
  const [savedDocuments, setSavedDocuments] = useState<any[]>([]);

  const toggleSaveDocument = (doc: any) => {
    setSavedDocuments(prev => {
      const exists = prev.find(d => d.id === doc.id);
      if (exists) {
        return prev.filter(d => d.id !== doc.id);
      }
      return [...prev, doc];
    });
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadAuth = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setIsLoggedIn(true);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Tải khóa học đã lưu của riêng user này
        const storedEnrolled = await AsyncStorage.getItem('enrolled_' + parsedUser.id);
        if (storedEnrolled) {
          setEnrolled(JSON.parse(storedEnrolled));
        }
      }
    };
    loadAuth();
  }, []);

  const login = async (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    
    // Khi đăng nhập, tải lại đúng khóa học của user đó
    const storedEnrolled = await AsyncStorage.getItem('enrolled_' + userData.id);
    if (storedEnrolled) {
      setEnrolled(JSON.parse(storedEnrolled));
    } else {
      setEnrolled([]); // Reset về trống nếu là tài khoản mới/chưa đăng ký gì
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  const enrollCourse = async (id: string, type: 'free' | 'paid') => {
    let newEnrolled = [...enrolled];
    if (type === 'free') {
      const course = recommended.find(c => c.id === id);
      if (course) {
        setRecommended(prev => prev.filter(c => c.id !== id));
        newEnrolled = [...enrolled, course];
        setEnrolled(newEnrolled);
      }
    } else {
      const course = premium.find(c => c.id === id);
      if (course) {
        setPremium(prev => prev.filter(c => c.id !== id));
        newEnrolled = [...enrolled, course];
        setEnrolled(newEnrolled);
      }
    }
    
    // Lưu ngay lập tức vào bộ nhớ máy để không bị mất khi thoát app
    if (user && user.id) {
      await AsyncStorage.setItem('enrolled_' + user.id, JSON.stringify(newEnrolled));
    }
  };

  const getCourseById = (id: string) => {
    return [...enrolled, ...recommended, ...premium].find(c => c.id === id);
  };

  const unenrollCourse = async (id: string) => {
    const courseToUnenroll = enrolled.find(c => c.id === id);
    if (!courseToUnenroll) return;

    const newEnrolled = enrolled.filter(c => c.id !== id);
    setEnrolled(newEnrolled);

    if (courseToUnenroll.type === 'free') {
      setRecommended(prev => [...prev, courseToUnenroll]);
    } else {
      setPremium(prev => [...prev, courseToUnenroll]);
    }

    if (user && user.id) {
      await AsyncStorage.setItem('enrolled_' + user.id, JSON.stringify(newEnrolled));
    }
  };

  return (
    <CourseContext.Provider value={{ enrolled, recommended, premium, enrollCourse, unenrollCourse, getCourseById, isLoggedIn, user, login, logout, setUser, savedDocuments, toggleSaveDocument }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => useContext(CourseContext);
