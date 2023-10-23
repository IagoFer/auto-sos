import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PaginaLogin from './PaginaLogin';
import PaginaCadastro from './PaginaCadastro';
import PaginaMenu from './PaginaMenu';
import PerfilEmpresa from './PerfilEmpresa';
import PerfilUsuario from './PerfilUsuario';
import PaginaCadastroEmpresa from './PaginaCadastroEmpresa';
import { UserProvider } from './UserContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Inicio">
      <Drawer.Screen name="Inicio" component={PaginaMenu} />
      <Drawer.Screen name="Seu Perfil" component={PerfilUsuario} />
      {/* Adicione outras telas de menu aqui, se necessário */}
    </Drawer.Navigator>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="PaginaLogin">
          {isLoggedIn ? (
            <>
              <Stack.Screen
                name="Drawer"
                component={DrawerNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="PerfilEmpresa" component={PerfilEmpresa} options={{ headerShown: true }} />
              {/* Adicione outras telas que devem ter um cabeçalho aqui */}
            </>
          ) : (
            <>
              <Stack.Screen
                name="PaginaLogin"
                component={({ navigation }) => (
                  <PaginaLogin
                    navigation={navigation}
                    setIsLoggedIn={setIsLoggedIn}
                  />
                )}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="PaginaCadastro" component={PaginaCadastro} options={{ headerShown: false }} />
              <Stack.Screen name="PaginaCadastroEmpresa" component={PaginaCadastroEmpresa} options={{ headerShown: false }} />
              {/* Adicione outras telas que não devem ter um cabeçalho aqui */}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;
