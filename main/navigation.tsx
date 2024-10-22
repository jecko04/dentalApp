// AppNavigator.js or AppNavigator.tsx
import * as React from 'react';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../main/LoginScreen';
import Home from './user/Users';
import RecordDetails from './tabs/RecordDetails';
import ManageProfile from './tabs/ManageProfile';

  export type RootStackParamList = {
    Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  };

  export type OnboardingStackParamList = {
    Login: undefined;
    Home: undefined;
    RecordDetails: { appointment: any };
    ManageProfile: undefined;
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
            <OnboardingStack.Screen name="RecordDetails" component={RecordDetails} />
            <OnboardingStack.Screen name="ManageProfile" component={ManageProfile} />
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