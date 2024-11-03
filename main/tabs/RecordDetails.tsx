import { StyleSheet, Text, View } from 'react-native'
import React, { } from 'react'
import { IconButton, Divider  } from 'react-native-paper';
import { useAppNavigation } from '../utils/useAppNaviagtion';
import Logo from '../Logo';

const RecordDetails = ({ route }: { route: any }) => {
  const {appointment} = route.params; 
  const navigation = useAppNavigation();

  const formatTime = (time: any) => {
    const [hours, minutes] = time.split(':');
    let hours12 = parseInt(hours, 10);
    const suffix = hours12 >= 12 ? 'PM' : 'AM';

    hours12 = hours12 % 12 || 12;

    return `${hours12}:${minutes} ${suffix}`;
  }

  const appointmentTime12hr = formatTime(appointment.appointment_time);
  const rescheduleTime12hr = appointment.reschedule_time 
  ? formatTime(appointment.reschedule_time) 
  : 'No Reschedule time';

  return (
    <>
        <View className=' bg-[#ff4200] rounded-b-lg max-h-20 h-full flex flex-row justify-between items-center pt-5 pr-20 shadow-xl shadow-[#FF4200]'>
          <IconButton icon="keyboard-backspace" size={30} iconColor='#FFFFFF' 
          onPress={
            navigation.goBack
          }/>
          <Text className='text-lg text-white'>Dental Appointment Details</Text>
        </View>
        {appointment ? (
          <View className='px-6 py-10 flex flex-col gap-3 shadow-lg shadow-black bg-white mx-4 mt-6 rounded-xl'>
            <Logo/>
          <Text className='text-lg pt-10'>Name: {appointment.name}</Text>
          <Divider bold style={{ 
            marginTop: 28, 
            marginHorizontal: 11, 
            backgroundColor: '#ff4200'  
          }} />
          <Text className='text-lg'>Service: {appointment.services}</Text>
          <Divider bold style={{ 
            marginTop: 28, 
            marginHorizontal: 11, 
            backgroundColor: '#ff4200'  
          }} />
          <Text className='text-lg'>Branch: {appointment.branch}</Text>
          <Divider bold style={{ 
            marginTop: 28, 
            marginHorizontal: 11, 
            backgroundColor: '#ff4200'  
          }} />
          <Text className='text-lg'>Appointment Date: {appointment.appointment_date}</Text>
          <Divider bold style={{ 
            marginTop: 28, 
            marginHorizontal: 11, 
            backgroundColor: '#ff4200'  
          }} />
          <Text className='text-lg'>Appointment Time: {appointmentTime12hr}</Text>
          <Divider bold style={{ 
            marginTop: 28, 
            marginHorizontal: 11, 
            backgroundColor: '#ff4200'  
          }} />
          <Text className='text-lg'>Reschedule Date: {appointment.reschedule_date ? appointment.reschedule_date : "No Reschedule Date"}</Text>
          <Divider bold style={{ 
            marginTop: 28, 
            marginHorizontal: 11, 
            backgroundColor: '#ff4200'  
          }} />
          <Text className='text-lg'>Reschedule Time: {rescheduleTime12hr}</Text>
          <Divider bold style={{ 
            marginTop: 28, 
            marginHorizontal: 11, 
            backgroundColor: '#ff4200'  
          }} />
          <Text className='text-lg text-center text-green-600'>Status: {appointment.status}</Text>
        </View>
        ) : (
        <View className='flex flex-col gap-4 items-center mt-3'>
                <IconButton icon="database-remove-outline" size={60} iconColor='#D3D3D3'/>
                <Text className=''>No Data Available</Text> 
        </View>
        )}
            
    </>
  )
}

export default RecordDetails

const styles = StyleSheet.create({
  container: {
    shadowColor: "#3e3e3e",
  }
})