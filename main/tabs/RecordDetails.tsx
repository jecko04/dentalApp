import { StyleSheet, Text, View, ScrollView, ToastAndroid, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { IconButton, Divider, Card, Button, PaperProvider, Portal, Modal, TextInput  } from 'react-native-paper';
import { useAppNavigation } from '../utils/useAppNaviagtion';
import Logo from '../Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RecordDetails = ({ route }: { route: any }) => {
  const {appointment, dentalDetails} = route.params; 
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

  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const [filteredReasons, setFilteredReasons] = useState<any[]>([]);
  const [filteredRecord, setFilteredRecord] = useState<any[]>([]);
  const [filteredRecord2, setFilteredRecord2] = useState<any[]>([]);
  const [filteredRecord3, setFilteredRecord3] = useState<any[]>([]);

  const [notes, setNotes] = useState({
    success: false,
    data: {
      notes: [{
        id: null,
        user_id: null,
        email: null,
        notes: null,
        created_at: null,
        updated_at: null,
      }],
      reschedule_reasons: [{
        id: null,
        appointment_id: null,
        user_id: null,
        reason: null,
        created_at: null,
        updated_at: null,
      }],
    }
  });

  const fetchNotes = async () => {
    setRefreshing(true);
    try{
      const token = await AsyncStorage.getItem('token');
      console.log("Token from AsyncStorage:", token); 
      if (!token) {
        console.log("Token not found.");
        setRefreshing(false);
        return;
      }

      const response = await axios.get('https://099c-136-158-2-237.ngrok-free.app/api/mobile/notes', {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      if (response.data.success) {
        setNotes(response.data);
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
    fetchNotes();
  }, []);

  useEffect(() => {
    if (notes) {

      const userNotes = notes?.data?.notes.filter(
        (note: any) => note.user_id === appointment.user_id
      );

      const userReasons = notes?.data?.reschedule_reasons.filter(
        (reason: any) => reason.user_id === appointment.user_id
      );

      setFilteredNotes(userNotes || []);
      setFilteredReasons(userReasons || []);
    }
  }, [notes, appointment]);

  useEffect(() => {
    if (dentalDetails) {
      const filteredPersonal = dentalDetails.data?.patients.filter((patient: any) => patient.user_id === appointment.user_id);
      setFilteredRecord(filteredPersonal || []);

      if (filteredPersonal && filteredPersonal.length > 0) {
        const filteredMedical = dentalDetails.data?.medical_history.filter((medical: any) =>
          filteredPersonal.some((patient: any) => patient.id === medical.patient_id)
        );
        setFilteredRecord2(filteredMedical || []);
      }

      if (filteredPersonal && filteredPersonal.length > 0) {
        const filteredDental = dentalDetails.data?.dental_history.filter((dental: any) =>
          filteredPersonal.some((patient: any) => patient.id === dental.patient_id)
        );
        setFilteredRecord3(filteredDental || []);
      }
    }
    
  }, [dentalDetails, appointment]);


  const containerStyle = {padding: 10};
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [visible2, setVisible2] = useState(false);

  const showModal2 = () => setVisible2(true);
  const hideModal2 = () => setVisible2(false);

  const [visible3, setVisible3] = useState(false);

  const showModal3 = () => setVisible3(true);
  const hideModal3 = () => setVisible3(false);


  const [editingNoteId, setEditingNoteId] = useState(null); 
  const [tempNote, setTempNote] = useState(''); 

  const handleEdit = (note: any) => {
    setEditingNoteId(note.id);
    setTempNote(note.notes);
    setUpdate((prev) => ({ ...prev, user_id: note.user_id })); 
  };
  
  const handleSave = async (note: any) => {
    if (!tempNote.trim()) {
      ToastAndroid.showWithGravityAndOffset(
        'Note cannot be empty.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
  
    setLoading(true);  // Set loading state while saving
  
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("Token from AsyncStorage:", token); 
      if (!token) {
        console.log("Token not found.");
        setRefreshing(false);
        return;
      }
  
      const response = await axios.post('https://099c-136-158-2-237.ngrok-free.app/api/mobile/editnotes', {
        notes: tempNote, 
        user_id: note.user_id,
      }, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.data.success) {
        ToastAndroid.showWithGravityAndOffset(
          'Note saved successfully!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
        setEditingNoteId(null); 
        setTempNote(''); 
      } else {
        console.log("API Response indicates failure:", response.data);
      }
      console.log("API Response:", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingNoteId(null); 
    setTempNote('');
  };

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState<{
    notes: string;
    user_id: any;
  }>({
    notes: "",
    user_id: null,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotes(); 
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <>
    <PaperProvider>
    <ScrollView
    refreshControl={ 
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      
        <View className=' bg-[#ff4200] rounded-b-lg max-h-20 h-full flex flex-row justify-between items-center pt-5 pr-20 shadow-xl shadow-[#FF4200]'>
          <IconButton icon="keyboard-backspace" size={30} iconColor='#FFFFFF' 
          onPress={
            navigation.goBack
          }/>
          <Text className='text-lg text-white'>Dental Appointment Details</Text>
        </View>

        {refreshing ? (
        <>
        </>
      ) : (
        <>
        {appointment ? (
          <View className='px-6 py-10 flex flex-col gap-3 shadow-lg bg-white mx-4 mt-6 rounded-xl'>
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

        <View className='flex flex-col pb-10 mx-4 bg-white rounded-lg shadow-lg mt-4'>
            <Text className='text-lg p-5'>View Dental Patient Record:</Text>
            <View className='flex flex-row justify-around mx-4'>
              <Button
                mode="contained-tonal"
                buttonColor="#FF4200"
                textColor="#FFF"
                className="rounded-lg"
                onPress={showModal}
              >
                Personal Info.
              </Button>
              <Button
                mode="contained-tonal"
                buttonColor="#FF4200"
                textColor="#FFF"
                className="rounded-lg"
                onPress={showModal2}
              >
                Medical Info.
              </Button>
              <Button
                mode="contained-tonal"
                buttonColor="#FF4200"
                textColor="#FFF"
                className="rounded-lg"
                onPress={showModal3}
              >
                Dental Info.
              </Button>
            </View>
          </View>
      {/* Dental Record / Medical Record */}
      {filteredRecord.length > 0 ? (
        filteredRecord.map((patient, index) => (
          <Portal key={index}>
            <Modal  visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            <Card className='bg-white mt-4 mx-4 w-[1rem] p-2'>
              <Card.Content>
                <Text className='font-semibold text-lg'>Patient Personal Information</Text>
                <View className="border-t border-gray-300 pt-2">
                <View className="flex flex-row justify-between my-5">
                  <Text className="text-sm text-gray-600 font-medium">Name:</Text>
                  <Text className="text-sm text-gray-800 max-w-[200px]">{patient.fullname}</Text>
                </View>
                <Divider />

                <View className="flex flex-row justify-between my-5">
                  <Text className="text-sm text-gray-600 font-medium">Email:</Text>

                  <Text className="text-sm text-gray-800 max-w-[200px]">{patient.email}</Text>
                </View>
                <Divider/>

                <View className="flex flex-row justify-between my-5">
                  <Text className="text-sm text-gray-600 font-medium">Date of Birth:</Text>
                  <Text className="text-sm text-gray-800 max-w-[200px]">{patient.date_of_birth}</Text>
                </View>
                <Divider/>

                <View className="flex flex-row justify-between my-5">
                  <Text className="text-sm text-gray-600 font-medium">Age:</Text>
                  <Text className="text-sm text-gray-800 max-w-[200px]">{patient.age}</Text>
                </View>
                <Divider/>

                <View className="flex flex-row justify-between my-5">
                  <Text className="text-sm text-gray-600 font-medium ">Phone #:</Text>
                  <Text className="text-sm text-gray-800 max-w-[200px]">{patient.phone}</Text>
                </View>
                <Divider/>

                <View className="flex flex-row justify-between my-5">
                  <Text className="text-sm text-gray-600 font-medium">Address:</Text>
                  <Text className="text-sm text-gray-800 max-w-[200px]">{patient.address}</Text>
                </View>
                <Divider/>

                <View className="flex flex-row justify-between my-5">
                  <Text className="text-sm text-gray-600 font-medium">Emergency Contact:</Text>
                  <Text className="text-sm text-gray-800 max-w-[200px]">{patient.emergency_contact}</Text>
                </View>
              </View>
              </Card.Content>
            </Card>
            </Modal>
          </Portal>
        ))
      ) : (
        <Portal>
          <Modal visible={visible2} onDismiss={hideModal2} contentContainerStyle={containerStyle}>
            <Card className='bg-white mt-4 mx-4 w-[1rem] p-2'>
              <Card.Content>
                <Text className='font-semibold text-lg'>Patient Personal Information</Text>
                <View className="border-t border-gray-300 pt-2">
                  <Text className="text-sm text-gray-800">No personal information available for this patient.</Text>
                </View>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>
      )}

      {filteredRecord2 && filteredRecord2.length > 0 ? (
        filteredRecord2.map((medical, index) => (
          <Portal key={index}>
            <Modal visible={visible2} onDismiss={hideModal2} contentContainerStyle={containerStyle}>
              <Card className='bg-white mt-4 mx-4 w-[1rem] p-2'>
                <Card.Content>
                  <Text className='font-semibold text-lg'>Medical Information</Text>
                  <View className="border-t border-gray-300 pt-2">
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Medical Condition:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{medical.medical_conditions || 'No data'}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Current Medication:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{medical.current_medications || 'No data'}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Allergies:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{medical.allergies || 'No data'}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Past Dental Surgery:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{medical.past_surgeries || 'No data'}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Family Medical History:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{medical.family_medical_history || 'No data'}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Blood Pressure:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{medical.blood_pressure || 'No data'}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Heart Disease:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{medical.heart_disease === 1 ? "Yes" : medical.heart_disease === 0 || medical.heart_disease === undefined ? "No data" : "Invalid data"}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Diabetes:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{medical.diabetes === 1 ? "Yes" : medical.diabetes === 0 || medical.diabetes === undefined ? "No data" : "Invalid data"}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Smoker:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{medical.smoker === 1 ? "Yes" : medical.smoker === 0 || medical.smoker === undefined ? "No data" : "Invalid data"}</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </Modal>
          </Portal>
        ))
      ) : (
        <Portal>
          <Modal visible={visible2} onDismiss={hideModal2} contentContainerStyle={containerStyle}>
            <Card className='bg-white mt-4 mx-4 w-[1rem] p-2'>
              <Card.Content>
                <Text className='font-semibold text-lg'>Medical Record</Text>
                <View className="border-t border-gray-300 pt-2">
                  <Text className="text-sm text-gray-800">No medical information available for this patient.</Text>
                </View>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>
      )}

      {filteredRecord3 && filteredRecord3.length > 0 ? (
        filteredRecord3.map((dental, index) => (
          <Portal key={index}>
            <Modal visible={visible3} onDismiss={hideModal3} contentContainerStyle={containerStyle}>
              <Card className='bg-white mt-4 mx-4 w-[1rem] p-2'>
                <Card.Content>
                  <Text className='font-semibold text-lg'>Dental Information</Text>
                  <View className="border-t border-gray-300 pt-2">
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Past Dental Treatment:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{dental.past_dental_treatments || 'No data'}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Frequent Tooth Pain:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{dental.frequent_tooth_pain === 1 ? "Yes" : dental.frequent_tooth_pain === 0 || dental.frequent_tooth_pain === undefined ? "No data" : "Invalid data"}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Gum Disease:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{dental.gum_disease_history === 1 ? "Yes" : dental.gum_disease_history === 0 || dental.gum_disease_history === undefined ? "No data" : "Invalid data"}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Teeth Grinding:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{dental.teeth_grinding === 1 ? "Yes" : dental.teeth_grinding === 0 || dental.teeth_grinding === undefined ? "No data" : "Invalid data"}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Tooth Sensitivity:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{dental.tooth_sensitivity || 'No data'}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Orthodontic:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{dental.orthodontic_treatment === 1 ? "Yes" : dental.orthodontic_treatment === 0 || dental.orthodontic_treatment === undefined ? "No data" : "Invalid data"}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Dental Implants:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{dental.dental_implants === 1 ? "Yes" : dental.dental_implants === 0 || dental.dental_implants === undefined ? "No data" : "Invalid data"}</Text>
                    </View>
                    <Divider />
                    <View className="flex flex-row justify-between my-5">
                      <Text className="text-sm text-gray-600 font-medium">Bleeding Gums:</Text>
                      <Text className="text-sm text-gray-800 max-w-[200px]">{dental.bleeding_gums === 1 ? "Yes" : dental.bleeding_gums === 0 || dental.bleeding_gums === undefined ? "No data" : "Invalid data"}</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </Modal>
          </Portal>
        ))
      ) : (
        <Portal>
          <Modal visible={visible3} onDismiss={hideModal3} contentContainerStyle={containerStyle}>
            <Card className='bg-white mt-4 mx-4 w-[1rem] p-2'>
              <Card.Content>
                <Text className='font-semibold text-lg'>Medical Record</Text>
                <View className="border-t border-gray-300 pt-2">
                  <Text className="text-sm text-gray-800">No medical information available for this patient.</Text>
                </View>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>
      )}


        {/* Notes */}
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note, index) => (
          <Card className='bg-yellow-300 mt-4 mx-4 w-[1rem] p-2' key={index}>
            <Card.Actions>
            {editingNoteId === note.id ? (
                <>
                  <Button onPress={() => handleSave(note)} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
                  <Button onPress={handleCancel} disabled={loading}>Cancel</Button>
                </>
              ) : (
                <Text className="text-sm text-gray-500" onPress={() => handleEdit(note)}>
                  Edit
                </Text>
              )}
            </Card.Actions>
            <Card.Content>
              <Text className='font-semibold text-lg italic'>Added note!</Text>
              <Text className='font-semibold border-t mt-3 pt-2 text-center text-sm text-gray-500'>Created At: {new Date(note.updated_at).toISOString().split('T')[0]}</Text>
              {editingNoteId === note.id ? (
                <TextInput
                  value={tempNote}
                  onChangeText={(text) => setTempNote(text)} 
                  className="bg-yellow-300 p-2"
                />
              ) : (
                <Text className="text-lg pt-3">{note.notes || 'No notes available'}</Text>
              )}
            </Card.Content>
          </Card>
          ))
        ) : (
          <>
          
          </>
        )}

        {filteredReasons.length > 0 ? (
          filteredReasons.map((reason, index) => (
          <Card className='bg-yellow-300 mt-4 mb-8 mx-4 w-[1rem] p-2 ' key={index}>
            <Card.Content>
              <Text className='font-semibold text-lg italic'>Reason for rescheduled</Text>
              <Text className='font-semibold border-t mt-3 pt-2 text-center text-sm text-gray-500'>Created At: {new Date(reason.updated_at).toISOString().split('T')[0]}</Text>
              <Text className='text-lg pt-3'>{reason.reason || "No notes available"}</Text>
            </Card.Content>
          </Card>
          ))
        ) : (
          <>
          
          </>
        )}
        </>
      )}
        
      
    </ScrollView>
    </PaperProvider>


    </>
  )
}

export default RecordDetails

const styles = StyleSheet.create({
  container: {
    shadowColor: "#3e3e3e",
  }
})