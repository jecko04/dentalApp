import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card, Avatar, IconButton, Modal, Portal, Button } from 'react-native-paper'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import axios from 'axios';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const Appointment = () => {

  const [data, setData] = useState({
    success: false,
    data: {
      appointment: [{
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

  const fetchData = async () => {
    setLoading(true);
    try{
      const response = await axios.get('http://192.168.100.40/my_api/appointment.php');
        setData(response.data);
        console.log("API Response:", response.data);
    }
    catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false);
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


  const showModal = () => {
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
    
    <ScrollView className=' py-2'>
      {loading ? (
        <ActivityIndicator animating={true} color={MD2Colors.red800} size={'large'} className='mt-52'/>
      ) : (
      data.success && data.data.appointment.length > 0 ? (
        data.data.appointment.map((app, index) => (
          <>
          <Card key={index} className='rounded-sm shadow-lg m-1'>
            <Card.Title className='p-5'
              title={app.name + " - " + app.services}
              subtitle={app.branch + " - " + app.appointment_date + " - " + app.appointment_time}
              left={(props) => <Avatar.Icon {...props} icon="calendar" theme={customTheme} size={50}/>}
              right={(props) => <IconButton {...props} icon="dots-vertical" onPress={showModal} />}
            />
          </Card>

          <Portal>
            <Modal key={index} visible={isModalOpen} style={styles.container}>
            <Text>Appointment Details:</Text>
                  <Text>Name: {app?.name}</Text>
                  <Text>Service: {app?.services}</Text>
                  <Text>Branch: {app?.branch}</Text>
                  <Text>Appointment Date: {app?.appointment_date}</Text>
                  <Text>Appointment Time: {app?.appointment_time}</Text>
                  <Text>Reschedule Date: {app?.reschedule_date}</Text>
                  <Text>Reschedule Time: {app?.reschedule_time}</Text>
                  <IconButton icon="close" onPress={handleCancle} />
            </Modal>
          </Portal>


          </>
        ))
      ) : (
        <Text className='text-center flex items-center'>No Available Appointment!</Text>
      )
      )}
      
    </ScrollView>
    </PaperProvider>

    </>
  )
}

export default Appointment

const styles = StyleSheet.create({
  container: {
    backgroundColor:"#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 35,
    alignItems: 'center',
    padding: 15,
  },
})