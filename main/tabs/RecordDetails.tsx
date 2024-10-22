import { StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SegmentedButtons, DataTable, IconButton, Divider  } from 'react-native-paper';
import axios from 'axios';
import { useAppNavigation } from '../utils/useAppNaviagtion';

const RecordDetails = ({ route }: { route: any }) => {
  const {appointment} = route.params; 
  const navigation = useAppNavigation();

  return (
    <>
        <View className=' bg-[#ff4200] rounded-b-lg max-h-20 h-full flex flex-row justify-between items-center pt-5 pr-20'>
          <IconButton icon="keyboard-backspace" size={30} iconColor='#FFFFFF' 
          onPress={
            navigation.goBack
          }/>
          <Text className='text-lg text-white'>Dental Appointment Details</Text>
        </View>
        {appointment ? (
          <View className='flex gap-3 mt-4'>
          <Text className='text-lg'>Name: {appointment.name}</Text>
          <Text className='text-lg'>Service: {appointment.services}</Text>
          <Text className='text-lg'>Branch: {appointment.branch}</Text>
          <Text className='text-lg'>Appointment Date: {appointment.appointment_date}</Text>
          <Text className='text-lg'>Appointment Time: {appointment.appointment_time}</Text>
          <Text className='text-lg'>Reschedule Date: {appointment.reschedule_date}</Text>
          <Text className='text-lg'>Reschedule Time: {appointment.reschedule_time}</Text>
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
})