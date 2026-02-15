"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { TAdmin, TParent } from "./types";

export interface TUserContext {
  user: TAdmin | null;
  setUser: (parent: TAdmin) => void;
}

export const UserContext = createContext<TUserContext | null>(null);

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<TAdmin | null>(null);
  const setUser = (user: TAdmin) => {
    setUserState(user);
    sessionStorage.setItem("parent", JSON.stringify(user));
  };
  useEffect(() => {
    const parent = JSON.parse(sessionStorage.getItem("parent") as string);
    if (parent) {
      setUserState(JSON.parse(sessionStorage.getItem("parent") as string));
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
