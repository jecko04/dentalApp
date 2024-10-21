import { ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, Avatar, IconButton, Modal, Portal, Divider, Button } from 'react-native-paper'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import axios from 'axios';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

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
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
    //setLoading(true);
    setRefreshing(true);
    try{
      const response = await axios.get('http://192.168.2.104/my_api/appointment.php');
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

  const showModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true)
  }
  const handleCancle = () => {
    setIsModalOpen(false);
  }

  return (
    <>
    
    <PaperProvider>
    <View className=' bg-[#ff4200] rounded-b-lg max-h-28 h-full flex items-center'>
      <Text className='text-lg text-white mt-12'>Dental Appointment List</Text>
    </View>
    
    <ScrollView className=' py-4 px-2'
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
          <Card key={index} className='rounded-br-lg rounded-tr-none rounded-bl-none rounded-tl-lg m-1 bg-white' onPress={() => showModal(app)}>
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
        <Text className='text-center flex items-center'>No Available Appointment!</Text>
      )
      )}
      
    </ScrollView>
    <Portal >
            <Modal visible={isModalOpen} style={styles.container}>
            <View className='flex flex-row justify-between items-center'>
              <Text className='text-xl font-black'>Appointment Details:</Text>
              <IconButton icon="close" onPress={handleCancle} size={30} />
            </View>
              <Divider className='mr-4' bold/>
              {selectedAppointment && selectedAppointment ? (
                  <View className='flex gap-3 mt-4'>
                  <Text className='text-lg'>Name: {selectedAppointment?.name}</Text>
                  <Text className='text-lg'>Service: {selectedAppointment?.services}</Text>
                  <Text className='text-lg'>Branch: {selectedAppointment?.branch}</Text>
                  <Text className='text-lg'>Appointment Date: {selectedAppointment?.appointment_date}</Text>
                  <Text className='text-lg'>Appointment Time: {selectedAppointment?.appointment_time}</Text>
                  <Text className='text-lg'>Reschedule Date: {selectedAppointment?.reschedule_date}</Text>
                  <Text className='text-lg'>Reschedule Time: {selectedAppointment?.reschedule_time}</Text>
                  <Text className='text-lg text-center text-green-600'>Status: {selectedAppointment?.status}</Text>
              </View>
              ) : (
                <Text>No Data Available</Text> 
              )}
              
            </Modal>
          </Portal>
    </PaperProvider>

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