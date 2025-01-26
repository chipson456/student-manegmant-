import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const isExpired = decoded.exp * 1000 < Date.now(); // בדיקת תוקף
      if (isExpired) {
        localStorage.removeItem("token");
        return null;
      }
      return { ...decoded, token };
    }
    return null;
  });

  const updateUserInfo = (token) => {
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserInfo({ ...decoded, token });
      localStorage.setItem("token", token);

      // הגדרת התנתקות אוטומטית לפי תוקף הטוקן
      const expirationTime = decoded.exp * 1000 - Date.now();
      setTimeout(() => {
        setUserInfo(null);
        localStorage.removeItem("token");
        alert("הטוקן פקע, אנא התחבר מחדש.");
      }, expirationTime);
    } else {
      setUserInfo(null);
      localStorage.removeItem("token");
    }
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
