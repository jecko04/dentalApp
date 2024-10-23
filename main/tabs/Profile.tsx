import { Image, RefreshControl, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Text, Avatar, List, Divider } from 'react-native-paper'
import axios from 'axios'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Alert } from 'react-native';
import { useAppNavigation } from '../utils/useAppNaviagtion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';


const Profile = ({ route = useRoute }: { route: any }) => {

  const [data, setData] = useState({
    success: false,
    data: {
      name: null,
    },
  });

  const [image, setImage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useAppNavigation();

  const handleLogout = async () => {
    setRefreshing(true);
    try {

      const response = await axios.post('http://192.168.100.40/my_api/logout.php');
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
  finally {
    setRefreshing(false);
  }
  }

  const fetchData = async () => {
    setRefreshing(true);
    try { 

      const storedImage = await AsyncStorage.getItem('avatarImage');
      if (storedImage) {
          setImage(storedImage); 
      }

       const response = await axios.get('http://192.168.100.40/my_api/profile.php');
        setData(response.data);
        //console.log("API Response:", response.data);
    }
    catch (error) {
      console.error("Error fetching welcome message:", error);
    }
    finally {
      setRefreshing(false);
    }
  }
  const fetchImageFromStorage = async () => {
    const storedImage = await AsyncStorage.getItem('avatarImage');
    if (storedImage) {
        setImage(storedImage);
        console.log("Retrieved image from AsyncStorage:", storedImage);
    }
};


useEffect(() => {
  fetchData();

  if (route.params?.image) {
      setImage(route.params.image);
  }
}, [route.params?.image]);

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  return (
    <>
    <ScrollView className=''
    refreshControl={ 
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
          <View className=' bg-[#ff4200] rounded-b-lg max-h-60 h-full flex items-center'>
            <Text className='text-lg text-white mt-10'>Profile</Text>
            {image ? (
                <Image source={{ uri: image }} style={{ width: 90, height: 90, borderRadius: 50 }} className='mt-3'/>
            ) : (
                <Image source={require('../images/avatar.jpg')} style={{ width: 90, height: 90, borderRadius: 50 }} className='mt-3'/>
            )}
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
          </ScrollView>
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