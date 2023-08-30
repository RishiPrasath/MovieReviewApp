import React, { createContext, useContext, useState } from 'react';

type UserContextType = {
  loggedIn: boolean;
  userID: string | null;
  username: string | null;
  login: (userID: string, username: string) => void; // Update the login function
  logout: () => void; // Define the logout function
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const login = (userID: string, username: string) => { // Update this line
    setLoggedIn(true);
    setUserID(userID);
    setUsername(username);
  };

  const logout = () => { // Define the logout function
    setLoggedIn(false);
    setUserID(null);
    setUsername(null);
  };

  return (
    <UserContext.Provider value={{ loggedIn, userID, username, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
