import { View, Text, StyleSheet, Image, Alert, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import Logo from './Logo';
import axios from 'axios';
import { useAppNavigation } from './utils/useAppNaviagtion';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const Login = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigation = useAppNavigation();

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');

    try {
        const response = await axios.post('http://192.168.2.104/my_api/login.php', {
            email,
            password,
        }, { timeout: 5000 });

        console.log("API Response:", response.data); 

        setMessage(response.data.message);
        if (response.data.success) { // Check for success

              navigation.navigate('Onboarding', {
                  screen: "Home",
              });
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

const showToastWithGravityAndOffset = () => {
  handleLogin();
  ToastAndroid.showWithGravityAndOffset(
    'Account Login Successfully!',
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};

  
  return (
    <>
      {loading ? (
        
        <ActivityIndicator animating={true} color={MD2Colors.red800} size={'large'} />
      ) : (
        <>
        <View style={styles.container}>
        <Logo/>

        <Text style={styles.title}>Login</Text>
        
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.inputs}
          placeholder="Email"
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
        />

        <Button 
          mode="contained"
          onPress={() => showToastWithGravityAndOffset()}
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
  },
  inputs: {
    width: '100%',
    marginBottom: 16, 
  },
})

export default Login