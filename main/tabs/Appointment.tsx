import { ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, Avatar, IconButton, Modal, Portal, Divider, Button } from 'react-native-paper'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { useAppNavigation } from '../utils/useAppNaviagtion';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Appointment = () => {

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
        reschedule_date: null,
        reschedule_time: null,
        status: null,
      }],
    }
  });
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useAppNavigation();

  const [selectedAppointment, setSelectedAppointment] = useState<{
    id: string | null;
    name: string | null;
    services: string | null;
    branch: string | null;
    appointment_date: string | null;
    appointment_time: string | null;
    reschedule_date: string | null;
    reschedule_time: string | null;
    status: string | null;
  } | null>(null);

  const fetchData = async () => {
    setRefreshing(true);
    try{
      const token = await AsyncStorage.getItem('token');
      console.log("Token from AsyncStorage:", token); 
      if (!token) {
        console.log("Token not found.");
        setRefreshing(false);
        return;
      }

      const response = await axios.get('https://6857-110-54-150-100.ngrok-free.app/api/mobile/appointment', {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      if (response.data.success) {
        setData(response.data);
      } else {
        console.log("API Response indicates failure:", response.data);
      }
      
      console.log("API Response:", response.data);
    }
    catch (error) {
      console.log(error);
    }
    finally{
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchData();
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
    
    <View className=' bg-[#ff4200] rounded-b-lg max-h-28 h-full flex items-center shadow-2xl shadow-[#000000]'>
      <Text className='text-lg text-white mt-12'>Dental Appointment List</Text>
    </View>
    
    <ScrollView className=' py-4 px-2'
    refreshControl={ 
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    style={{ padding: 10 }}
    >
      {refreshing ?(
        <></>
      ) : (
      data.success && data.data.appointment.length > 0 ? (
        data.data.appointment.map((app, index) => (
          <Card key={app.id || index} className='rounded-br-lg rounded-tr-none rounded-bl-none rounded-tl-lg m-1 bg-white'
          onPress={() => handleOnboard(app)}>
            <Card.Title className='py-2'
              title={app.name + " - " + app.services}
              subtitle={app.branch + " - " + app.appointment_date + " - " + formatTime(app.appointment_time)}
              left={(props) => <Avatar.Icon {...props} icon="calendar" theme={customTheme} size={50}
              style={styles.card}
              />}
            />
          </Card>
        ))
      ) : (
        <View className='flex flex-col gap-4 items-center mt-3'>
                <IconButton icon="database-remove-outline" size={60} iconColor='#D3D3D3'/>
                <Text className=''>No Data Available</Text> 
        </View>
      )
      )}
      
    </ScrollView>

    </>
  )
}

export default Appointment

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