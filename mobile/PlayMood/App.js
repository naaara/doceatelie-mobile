// App.js — ponto de entrada com navegação Stack
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen       from './screens/HomeScreen';
import DetalhesProduto  from './screens/DetalhesProduto';
import DetalhesCliente  from './screens/DetalhesCliente';
import DetalhesPedido   from './screens/DetalhesPedido';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle:       { backgroundColor: '#FFFFFF', elevation: 0, shadowOpacity: 0 },
          headerTintColor:   '#5C1E32',
          headerTitleStyle:  { fontFamily: 'serif', fontWeight: 'bold', fontSize: 18 },
          headerBackTitleVisible: false,
          cardStyle:         { backgroundColor: '#F8F9FA' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetalhesProduto"
          component={DetalhesProduto}
          options={{ title: 'Detalhes do produto' }}
        />
        <Stack.Screen
          name="DetalhesCliente"
          component={DetalhesCliente}
          options={{ title: 'Detalhes do cliente' }}
        />
        <Stack.Screen
          name="DetalhesPedido"
          component={DetalhesPedido}
          options={{ title: 'Detalhes do pedido' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}