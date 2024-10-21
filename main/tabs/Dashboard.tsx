import { ScrollView, StyleSheet, Text, View, RefreshControl, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, Avatar, IconButton, Modal, Portal, Divider, Button } from 'react-native-paper'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import axios from 'axios';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import Logo from '../Logo';

const Dashboard = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
      appointment: [{
        id: null,
        name: null,
        services: null,
        branch: null,
        appointment_date: null,
        appointment_time: null,
        status: null,
      }],
      name: null,
    }
  });

  const fetchData = async () => {
    //setLoading(true);
    setRefreshing(true);
    try{
      const response = await axios.get('http://192.168.2.104/my_api/dashboard.php');
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
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
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

  return (
    <>
    <View className=' bg-[#ff4200] rounded-b-lg max-h-36 h-full flex items-center'>
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
      {data.success && data.data?.name ? data.data.name : 'Loading...'}
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

          <Card key={index} className='rounded-br-lg rounded-tr-none rounded-bl-none rounded-tl-lg m-1 bg-white'>
            <Card.Title className='py-2'
              title={app.name + " - " + app.services}
              subtitle={app.branch + " - " + app.appointment_date + " - " + app.appointment_time}
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

    {/* <Divider bold style={{ 
    marginTop: 28, 
    marginHorizontal: 11, 
    backgroundColor: '#ff4200'  
  }} /> */}
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