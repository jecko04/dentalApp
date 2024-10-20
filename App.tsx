import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SplashScreen from './splash/SplashScreen';
import LoginScreen from './main/LoginScreen';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './main/navigation';

export default function App() {

  const [isShowSplash, setIsShowSplash] = useState(true);
    
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []); 

  return (
   
    (isShowSplash ? (
      <SplashScreen/>
    ) : (
      <>
      <NavigationContainer>
        <RootNavigator/>
      </NavigationContainer>
      </>
    ))
  );
}


