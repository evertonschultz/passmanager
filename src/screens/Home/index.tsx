import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useStorageData } from '../../hooks/useStorageData';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage
} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [logins, setLogins] = useState<LoginListDataProps>([]);

//  const { data } = useStorageData();
//  setLogins(data);
//  console.log('INDEX');
//  console.log(data);

  const { getItem } = useStorageData();

  async function handleLoadLoginsData() {
  //  const dataKey = '@passmanager:logins';
  //  await AsyncStorage.removeItem(dataKey);
    const data = await getItem();
    console.log('INDEX');
    console.log(data);
    setLogins(data);
    setSearchListData(data);
  }

  function handleFilterLoginData(search: string) {
    const filterItems = (query: string) => {
      return logins.filter(el => el.title.toLowerCase().indexOf(query.toLowerCase()) > -1);
    }

    const filterSearch = filterItems(search);

    if(filterSearch) {
      setSearchListData(filterSearch);
    } else {
      setSearchListData([]);
    }

    search.length === 0 && setSearchListData(logins);
  }

  useEffect(() => {
//    const dataKey = '@gofinaces:transactions';
//    AsyncStorage.removeItem(dataKey);
    handleLoadLoginsData();
  },[]);

  useFocusEffect(useCallback(() => {
    handleLoadLoginsData();
  },[]));

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={(
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        )}
        renderItem={({ item: loginData }) => {
          return <LoginDataItem
            title={loginData.title}
            email={loginData.email}
            password={loginData.password}
          />
        }}
      />
    </Container>
  )
}