import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { Alert } from 'react-native';

interface ILoginsProviderProps {
  children: ReactNode;
}

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

interface FormData {
  title: string;
  email: string;
  password: string;
}

interface ILoginsContextData {
  getItem(): Promise<LoginListDataProps>;
  setItem(formData: FormData): Promise<void>;
}

const LoginsContext = createContext({} as ILoginsContextData);

function LoginsProvider({ children }: ILoginsProviderProps){
  const [data, setData] = useState<LoginListDataProps>([]);
  
  const dataKey = `@passmanager:logins`

  async function getItem() {
    const logisStorage = await AsyncStorage.getItem(dataKey);

    if (logisStorage) {
      const loginsList = JSON.parse(logisStorage) as LoginListDataProps;
      console.log('loginsList');
      console.log(loginsList);
      setData(loginsList);
      return loginsList;
    }
    return data;
  }
  
  async function setItem(formData: FormData) {
    const newLoginData = {
      id: String(uuid.v4()),
      ...formData
    }

    console.log('newLoginData');
    console.log(newLoginData);

    try {
      const logins = await AsyncStorage.getItem(dataKey);
      console.log('logins');
      console.log(logins);
      const currentData = logins ? JSON.parse(logins) : [];
      console.log('currentData');
      console.log(currentData);
  
      const dataFormated = [
        ...currentData,
        newLoginData
      ]
      console.log('dataFormated');
      console.log(dataFormated);
  
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormated));
    } catch (error) {
      Alert.alert('Não foi possível cadastrar! Tente novamente.')
    }
  }

  return (
    <LoginsContext.Provider value={{
      getItem,
      setItem,
    }}>
      { children }
    </LoginsContext.Provider>
  )
}

function useStorageData(){
  const context = useContext(LoginsContext);

  return context;
}

export { LoginsProvider, useStorageData };