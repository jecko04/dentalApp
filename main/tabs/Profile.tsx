import { StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Text, Avatar, List, Divider } from 'react-native-paper'
import axios from 'axios'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Alert } from 'react-native';
import { useAppNavigation } from '../utils/useAppNaviagtion';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';


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
    try{
      const logoutResponse = await axios.post('http://192.168.100.40/my_api/logout.php');
      if (logoutResponse.data.success) {

        navigation.navigate('Onboarding', {
          screen: "Login",
        });

      
      }else {
        Alert.alert("Logout failed", logoutResponse.data.message);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const showToastWithGravityAndOffset = () => {
    handleLogout();
    ToastAndroid.showWithGravityAndOffset(
      'Account Logout Successfully!',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

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
            onPress={() => showToastWithGravityAndOffset()}
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