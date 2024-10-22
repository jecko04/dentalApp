import { View, Text, StyleSheet, Image, Alert, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import Logo from './Logo';
import axios from 'axios';
import { useAppNavigation } from './utils/useAppNaviagtion';
import { ActivityIndicator, MD2Colors, Checkbox  } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigation = useAppNavigation();

  const handleLogin = async (storedEmail: any, storedPassword: any) => {
    setLoading(true);
    setMessage('');

    try {
        const response = await axios.post('http://192.168.100.40/my_api/login.php', {
          email: storedEmail || email,
          password: storedPassword || password,
            remember_me: rememberMe,
        }, { timeout: 5000 });

        console.log("API Response:", response.data); 
        console.log("is Click:" , rememberMe);

        setMessage(response.data.message);
        if (response.data.success) { // Check for success
          await AsyncStorage.setItem('Doctors_ID', String(response.data.Doctors_ID));

          if(rememberMe) {
            await AsyncStorage.setItem('remember_me', String(rememberMe));
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
          }else {
            await AsyncStorage.removeItem('remember_me');
            await AsyncStorage.removeItem('Email');
            await AsyncStorage.removeItem('Password');
          }
          navigation.navigate('Onboarding', {
              screen: "Home",
          });

          ToastAndroid.showWithGravityAndOffset(
            'Account Login Successfully!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        } else {
            Alert.alert("Login failed", response.data.message);
        }
    } catch (error) {
        console.error("Login error:", error);
        setMessage("An error occurred. Please try again.");
        Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
}

useEffect(() => {
  const checkRememberMe = async () => {
    const rememberMeValue = await AsyncStorage.getItem('remember_me');
    if (rememberMeValue === 'true') {
      const storedDoctorsId = await AsyncStorage.getItem('Doctors_ID');
      const storedEmail = await AsyncStorage.getItem('email'); 
      const storedPassword = await AsyncStorage.getItem('password');
      if (storedDoctorsId) {
        if (storedDoctorsId) {
          handleLogin(storedEmail, storedPassword); 
      }
      }
    }
  };
  checkRememberMe();
}, []);

  
  return (
    <>
      {loading ? (
        
        <ActivityIndicator animating={true} color={MD2Colors.red800} size={'large'} />
      ) : (
        <>
        <View className='flex flex-col justify-center items-center px-3 mt-36'>
        <Logo/>

        <View className='flex flex-col w-full'>
        <Text className='text-lg mt-6'>Login</Text>
        
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.inputs}
          placeholder="Email"
          left={<TextInput.Icon icon="email" />}
        />
        
        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.inputs}
          placeholder="Password"
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)} 
            />
          }
          left={<TextInput.Icon icon="account-lock" />}

        />

        <View className='flex flex-row gap-1 items-center'>
          <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => {
                  setRememberMe(!rememberMe);
                }}
              />
              <Text>Remember Me</Text>
        </View>
        </View>
        
        
        <Button 
          mode="contained"
          onPress={() => handleLogin(email, password)}
          textColor='#FFFFFF'
          className='rounded-md max-w-sm w-full bg-[#FF4200]'
          >
          Login
        </Button>

      </View>
      </>
      )}

    </>

  )
}

const styles = StyleSheet.create({
  inputs: {
    width: '100%',
    marginBottom: 16, 
  },
})

export default Login