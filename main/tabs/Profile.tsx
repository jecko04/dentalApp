import { StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Text, Avatar, List, Divider } from 'react-native-paper'
import axios from 'axios'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Alert } from 'react-native';
import { useAppNavigation } from '../utils/useAppNaviagtion';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Profile = () => {

  const [data, setData] = useState({
    success: false,
    data: {
      name: null,
    },
  });

  const [loading, setLoading] = useState(false);
  const navigation = useAppNavigation();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.100.40/my_api/logout.php'); // Adjust the URL as needed
      if (response.data.success) {

          await AsyncStorage.removeItem('Doctors_ID');
          await AsyncStorage.removeItem('remember_me');

          navigation.navigate('Onboarding', {
            screen: 'Login'}
          ); 

          ToastAndroid.showWithGravityAndOffset(
            'Account Logout Successfully!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
      } else {
          Alert.alert("Logout Failed", response.data.message);
      }
  } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
  }
  }

  const fetchData = async () => {
    try { 
       const response = await axios.get('http://192.168.100.40/my_api/profile.php');
        setData(response.data);
        console.log("API Response:", response.data);
    }
    catch (error) {
      console.error("Error fetching welcome message:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#ffffff',   
      background: '#000000',
      surface: '#ff4200',
         
    },
  };

  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

  const handleProfile = () => {
    navigation.navigate("Onboarding", {
      screen: 'ManageProfile',
    })
  }

  return (
    <>

      {loading? (
        <ActivityIndicator animating={true} color={MD2Colors.red800} size={'large'} />
      ) : (
        <>
          <View className=' bg-[#ff4200] rounded-b-lg max-h-60 h-full flex items-center'>
            <Text className='text-lg text-white mt-10'>Profile</Text>
            <Avatar.Icon size={70} icon="account" theme={customTheme} className='mt-7'/>
            <Text className='text-white text-center text-xl mt-4'>
            {data.success && data.data?.name ? data.data.name : 'Loading...'}
            </Text> 
          </View>

          <View className=' mx-7 my-9'>
            <List.Section title="Profile">
              <List.Accordion
                title="Manage User Profile"
                left={props => <List.Icon {...props} icon="account-settings-outline" />}
                expanded={expanded}
                onPress={handlePress}
                style={styles.container}
                titleStyle={styles.textColor}
                >
                <List.Item title="Profile" 
                key="id"
                onPress={handleProfile}
                left={props => <List.Icon {...props} icon="account-circle-outline" 
                />}
                />
                <List.Item title="Change Password" 
                key="id1"
                left={props => <List.Icon {...props} icon="account-lock-outline" />}
                />
              </List.Accordion>
            </List.Section>

            <Divider className='bg-[#ff4200] font-black'/>

            <Button icon="logout" mode="outlined" textColor='#ff4200' 
            className='rounded-md mt-5'
            onPress={() => handleLogout()}
            >
              Logout
            </Button>
          </View>
      </>
    
      )}
    
    </>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  textColor: {
    color: "#FF4200",
  },
});

export default Profile