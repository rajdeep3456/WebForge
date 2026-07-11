"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { OnSaveContext } from "@/context/OnSaveContext";

const Provider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<any>(null);
  const [onSaveData, setOnSaveData] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    user && createNewUser();
  }, [user]);

  const createNewUser = async () => {
    //if user exists
    const result = await axios.post("/api/users", {});
    setUserDetail(result.data?.user);
  };

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <OnSaveContext.Provider
          value={{ onSaveData, setOnSaveData, saveLoading, setSaveLoading }}
        >
          {children}
        </OnSaveContext.Provider>
      </UserDetailContext.Provider>
    </div>
  );
};

export default Provider;
