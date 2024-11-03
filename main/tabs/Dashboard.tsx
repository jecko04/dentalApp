import { ScrollView, StyleSheet, Text, View, RefreshControl, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, Avatar, IconButton, Modal, Portal, Divider, Button } from 'react-native-paper'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import axios from 'axios';
import Logo from '../Logo';
import { useAppNavigation } from '../utils/useAppNaviagtion';


const Dashboard = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useAppNavigation();
  const [selectedAppointment, setSelectedAppointment] = useState<{
    id: string | null;
    name: string | null;
    services: string | null;
    branch: string | null;
    appointment_date: string | null;
    appointment_time: string | null;
    status: string | null;
  } | null>(null);

  const [data, setData] = useState({
    success: false,
    data: {
      name: null,
      appointment: [{
        id: null,
        name: null,
        services: null,
        branch: null,
        appointment_date: null,
        appointment_time: null,
        status: null,
      }],
    },
  });

  const [dataName, setDataName] = useState({
    success: false,
    data: {
      name: null,
    }
  })

  const fetchNameData = async () => {
    setRefreshing(true);
    try{
      const response = await axios.get('https://2738-136-158-2-21.ngrok-free.app/my_api/profile.php');
      setDataName(response.data);
        console.log("API Response Get name:", response.data);
    }
    catch (error) {
      console.log(error);
    }
    finally{
      //setLoading(false);
      setRefreshing(false);

    }
  }

  const fetchData = async () => {
    //setLoading(true);
    setRefreshing(true);
    try{
      const response = await axios.get('https://2738-136-158-2-21.ngrok-free.app/my_api/dashboard.php');
        setData(response.data);
        console.log("API Response:", response.data);
    }
    catch (error) {
      console.log(error);
    }
    finally{
      //setLoading(false);
      setRefreshing(false);

    }
  }
  useEffect(() => {
    fetchData();
    fetchNameData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    fetchNameData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#FFFFFF',   
      background: '#000000',
      surface: '#ff4200',
    },
  };

  const handleOnboard = (appointment: any) => {
    setSelectedAppointment(appointment);
    navigation.navigate('Onboarding', {
      screen: 'RecordDetails',
      params: { appointment }, 
    });
  };

  const formatTime = (time: any) => {
    const [hours, minutes] = time.split(':');
    let hours12 = parseInt(hours, 10);
    const suffix = hours12 >= 12 ? 'PM' : 'AM';

    hours12 = hours12 % 12 || 12;

    return `${hours12}:${minutes} ${suffix}`;
  }

  return (
    <>
    <View className=' bg-[#ff4200] rounded-b-lg max-h-36 h-full flex items-center shadow-2xl shadow-[#000000]'>
      <Text className='text-lg text-white mt-16'>Dashboard</Text>
    </View>

    <View className='flex flex-row items-center gap-1 mt-3 px-2'>
    <Image source={require('../images/image.png')} className='h-14 w-14'/>
    <Text className='text-lg text-[#FF4200]'>STMC -</Text>
    <Text className='text-lg text-[#2938DA]'>Dental</Text>
    <Text className='text-lg text-[#FADC12]'>Care</Text>
    </View>

    <View className='px-3 mt-3'>
      <Text className='text-xl font-semibold'>Welcome Back!</Text>
      <Text className='text-xl text-[#ff4200]'> 
      {dataName.success && dataName.data?.name ? dataName.data.name : 'Loading...'}
      </Text>
    </View>

    <Text className='text-[#000000] flex justify-start px-2 text-xl mt-20 font-black'>Today's Appointment</Text>
    <ScrollView className=' py-4 px-2 max-h-64 h-full mt-3'
    refreshControl={ 
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    style={{ padding: 10 }}
    >
      {refreshing ?(
        <></>
        //<ActivityIndicator animating={true} color={MD2Colors.red800} size={'large'} className='mt-52'/>
      ) : (
      data.success && data.data.appointment.length > 0 ? (
        data.data.appointment.map((app, index) => (
          <>

          <Card key={index} className='rounded-br-lg rounded-tr-none rounded-bl-none rounded-tl-lg m-1 bg-white'
          onPress={() => handleOnboard(app)}
          >
            <Card.Title className='py-2'
              title={app.name + " - " + app.services}
              subtitle={app.branch + " - " + app.appointment_date + " - " + formatTime(app.appointment_time)}
              left={(props) => <Avatar.Icon {...props} icon="calendar" theme={customTheme} size={50}
              style={styles.card}
              />}
            />
          </Card>

          </>
        ))
      ) : (
        <Text className='text-center flex items-center'>No Appointment for today!</Text>
      )
      )}
      
    </ScrollView>

    
    </>

  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor:"#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 200,
    paddingLeft:15,
    borderRadius: 10,
  },
  card: {
    color: "#FF4200",
    backgroundColor: "#ff4200",
  },
  button: {
    color: "Green"
  },
})