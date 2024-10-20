// AppNavigator.js or AppNavigator.tsx
import * as React from 'react';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../main/LoginScreen'; // Update this path
import Home from './user/Users';



  export type RootStackParamList = {
    Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  };

  export type OnboardingStackParamList = {
    Login: undefined;
    Home: undefined;
  }
  
  const RootStack = createNativeStackNavigator<RootStackParamList>();
  const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

  const OnboardingNavigator = () => {
    return (
        <OnboardingStack.Navigator
        screenOptions={{ 
            headerShown: false,
         }}
        >
            <OnboardingStack.Screen name="Login" component={Login} />
            <OnboardingStack.Screen name="Home" component={Home} />
        </OnboardingStack.Navigator>
    );
  };

  export const RootNavigator = () => {
    return (
        <RootStack.Navigator
            screenOptions={{ 
                headerShown: false,
             }}
        >
            <RootStack.Screen name='Onboarding' component={OnboardingNavigator} />
        </RootStack.Navigator>
    );
  };