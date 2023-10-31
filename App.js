import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importe o ícone FontAwesome
import PaginaLogin from './PaginaLogin';
import PaginaCadastro from './PaginaCadastro';
import PaginaMenu from './PaginaMenu';
import PerfilEmpresa from './PerfilEmpresa';
import PerfilUsuario from './PerfilUsuario';
import PaginaCadastroEmpresa from './PaginaCadastroEmpresa';
import { UserProvider } from './UserContext';
import AdicionarCarro from './AdicionarCarro';
import { AcompanharRota } from './AcompanharRota';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Inicio">
      <Drawer.Screen name="Inicio" component={PaginaMenu} />
      <Drawer.Screen name="Seu Perfil" component={PerfilUsuario} />
      <Drawer.Screen name="Carro" component={AdicionarCarro} />
      <Drawer.Screen name="Acompanhar Rota" component={AcompanharRota} />
      <Drawer.Screen name="Sair" component={AcompanharRota} />
      {/* Adicione outras telas de menu aqui, se necessário */}
    </Drawer.Navigator>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigationRef = useRef();

  return (
    <UserProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="PaginaLogin">
          {isLoggedIn ? (
            <>
              <Stack.Screen
                name="Drawer"
                component={DrawerNavigator}
                options={{
                  headerRight: () => (
                    <TouchableOpacity
                      style={{ marginRight: 16 }}
                      onPress={() => {
                        setIsLoggedIn(false);
                        navigationRef.current?.resetRoot({
                          index: 0,
                          routes: [{ name: 'PaginaLogin' }],
                        });
                      }}
                    >
                      <Icon name="sign-out" size={20} color="white" />
                    </TouchableOpacity>
                  ),
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="PerfilEmpresa"
                component={PerfilEmpresa}
                options={{ headerShown: true }}
              />
              {/* Adicione outras telas que devem ter um cabeçalho aqui */}
            </>
          ) : (
            <>
              <Stack.Screen
                name="PaginaLogin"
                component={({ navigation }) => (
                  <PaginaLogin
                    navigation={navigation}
                    setIsLoggedIn={() => {
                      setIsLoggedIn(true);
                      navigationRef.current?.resetRoot({
                        index: 0,
                        routes: [{ name: 'Drawer' }],
                      });
                    }}
                  />
                )}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PaginaCadastro"
                component={PaginaCadastro}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PaginaCadastroEmpresa"
                component={PaginaCadastroEmpresa}
                options={{ headerShown: false }}
              />
              {/* Adicione outras telas que não devem ter um cabeçalho aqui */}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;
