import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid, RefreshControl, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { IconButton, Divider, Avatar, Button, TextInput, Modal, PaperProvider, Portal, HelperText} from 'react-native-paper';
import { useAppNavigation } from '../utils/useAppNaviagtion';
import axios from 'axios';
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import DateTimePicker from 'react-native-modal-datetime-picker';

const ManageProfile = () => {

    const navigation = useAppNavigation();
    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [update, setUpdate] = useState<{
        updateName: string;
        updateEmail: string;
        updateDateOfBirth: Date | null;
        profession: string; 
        license_number: string; 
        specialization: string; 
        license_expiry_date: Date | null;
    }>({
        updateName: "",
        updateEmail: "",
        updateDateOfBirth: null, 
        profession: "", 
        license_number: "", 
        specialization: "", 
        license_expiry_date: null, 

    });
    

   
    const [edit, setEdit] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [image, setImage] = useState<string | null>(null);
    const containerStyle = {backgroundColor: 'white',
        padding: 20,
    };

    const [data, setData] = useState({
        success: false,
        data: {
        name: null,
        name2: null,
        email: null,
        birth_date: null,
        profession: null,
        license_number: null,
        specialization: null,
        license_expiry_date: null,
        password: null,
        setProfile: [{
            Name: null,
            Email: null,
            Birth_Date: null,
            Profession: null,
            License_Number: null,
            Specialization: null,
            License_Expiry_Date: null,
        }]
        },
    });

    const [isVisible, setIsVisible] = useState(false);
    const [date, setDate] = useState(new Date());
  
    const handleConfirm = (selectedDate: any) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setUpdate({...update, updateDateOfBirth: currentDate}); 
        setIsVisible(false);
    };

    const handleEditDOB = () => {
        setIsVisible(true);
    };

    const [isVisible2, setIsVisible2] = useState(false);
    const [date2, setDate2] = useState(new Date());
  
    const handleConfirm2 = (selectedDate: any) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setUpdate({...update, license_expiry_date: currentDate}); 
        setIsVisible(false);
    };

    const handleEditDOB2 = () => {
        setIsVisible2(true);
    };

    const fetchData = async () => {
        setRefreshing(true);
        try{

            const token = await AsyncStorage.getItem('token');
            if (!token) {
              console.log("Token not found.");
              setRefreshing(false);
              return;
            }

            const response = await axios.get('https://099c-136-158-2-237.ngrok-free.app/api/mobile/getProfile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                  withCredentials: true,
            });
            setData(response.data);
            //console.log("API Response:", response.data);
        }
        catch (error) {
            console.log(error)
        }finally {
            setRefreshing(false);
        }

    }

    const handleUpdate = async () => {

        const formattedDOB = update.updateDateOfBirth ? update.updateDateOfBirth.toISOString().split('T')[0] : null; // Format to YYYY-MM-DD
        const formattedLicenseExpiry = update.license_expiry_date ? update.license_expiry_date.toISOString().split('T')[0] : null; // Format to YYYY-MM-DD

        if (!update.updateName) {
            ToastAndroid.show("Name cannot be empty", ToastAndroid.SHORT);
            return;
        }

        const validateEmail = (email: any) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };
    
        if (!update.updateDateOfBirth || !update.license_expiry_date) {
            ToastAndroid.show("Please select all date fields.", ToastAndroid.SHORT);
            return;
        }
        
        if (!validateEmail(update.updateEmail)) {
            ToastAndroid.show("Invalid email format", ToastAndroid.SHORT);
            return;
        }
    
        try {

            const token = await AsyncStorage.getItem('token');
            if (!token) {
              console.log("Token not found.");
              setRefreshing(false);
              return;
            }

            const responseUpdate = await axios.post('https://099c-136-158-2-237.ngrok-free.app/api/mobile/setProfile', {
                name: update.updateName,
                email: update.updateEmail,
                birth_date: formattedDOB,
                profession: update.profession,
                license_number: update.license_number,
                specialization: update.specialization,
                license_expiry_date: formattedLicenseExpiry,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setData(responseUpdate.data);
            console.log("API ResponseUpdate:", responseUpdate.data);
        } catch (error) {
            console.log(error)
        } finally {
            setRefreshing(false); 
        }
    }

    useEffect(() => {
        fetchData();
        const loadImage = async () => {
            try {
            const savedImage: any = await AsyncStorage.getItem('avatarImage');
                if (savedImage) {
                    setImage(savedImage);
                }
            } catch (error) {
                console.log("Error loading image: ", error);
            }
        }
        loadImage();
    }, []);

    const uploadImage = async () => {
        try {
            await ImagePicker.requestCameraPermissionsAsync();
            let result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.front,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                await saveImage(result.assets[0].uri)
            }
        }
        catch (error) {
            console.log("Error uploading images: ",error);
            setVisible(false);
        }
    }

    const uploadImageFromFiles = async () => {
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync(); 
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                saveImage(imageUri);
            }
        } catch (error) {
            console.log("Error uploading images: ", error);
        }
    };

    const clearImage = async () => {
        try {
            setImage(null);
            await AsyncStorage.removeItem('avatarImage'); 
        } catch (error) {
            console.log("Error clearing image: ", error);
        }
    };

    const saveImage = async (image: any) => {
        try {
            setImage(image);
            
            await AsyncStorage.setItem('avatarImage', image);
            navigation.navigate('Onboarding', {
                screen: 'Home',
                params: { image },
              });

            ToastAndroid.showWithGravityAndOffset(
                'Changed Profile Picture Successfully!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
              setVisible(false);
              
              
        }
        catch (error) {
            throw error;
        }
    }

    const handleEdit = () => {
        setEdit(true);
    }
    const exitEdit = () => {
        handleUpdate();
        setEdit(false);
        onRefresh();
    }
    const cancelEdit = () => {
        setEdit(false);
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
    

    <PaperProvider>
    <ScrollView className=''
    refreshControl={ 
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    style={{ padding: 10 }}
    >
    <View className='rounded-b-lg max-h-20 h-full flex flex-row justify-between items-center pt-2'>
            <IconButton icon="keyboard-backspace" size={30} iconColor='#000000' 
            onPress={
            navigation.goBack
            }/>
            <Text className='text-lg text-black text-center'>Manage Profile</Text>
            <Avatar.Icon icon={''} className='bg-transparent'/>
    </View>
    
    <View className='flex flex-row gap-2 items-center px-8 py-5 mt-4 bg-[#FF4200] rounded-xl'>        
        <Avatar.Image size={80} source={image ? { uri: image } : require('../images/avatar.jpg')} />
        <View className='flex flex-col justify-start items-start'>
            <Text className='text-xs pl-3 pt-3 ' style={{ color: "#FFFFFF" }}>
            {data.success && data.data?.name ? data.data.name : 'Loading...'}
            </Text>
            <Button className='' 
            textColor='#FFFFFF'
            icon="camera"
            onPress={showModal}
            >
                Change profile
            </Button>
        </View>
    </View>
    
    
        <Button className='items-end -bottom-10 pr-6 rounded-sm' textColor='gray' onPress={handleEdit}>Edit</Button>
        <View className='flex flex-col gap-2 items-center px-10 pt-5'>  
        <TextInput
            mode="flat"
            label="Fullname"
            value={edit ? update.updateName : (data.success && data.data?.setProfile[0]?.Name ? data.data.setProfile[0].Name : 'Loading...')}
            onChangeText={Text => setUpdate({...update, updateName: Text})}
            placeholder="Fullname"
            className='w-full bg-transparent'
            textColor='#000000'
            disabled={!edit}
            left={<TextInput.Icon icon="account" />}
            underlineColor='#FF4200'
        />
        <TextInput
            mode="flat"
            label="Email"
            value={edit ? update.updateEmail : (data.success && data.data?.setProfile[0]?.Email ? data.data.setProfile[0].Email : 'Loading...')}
            onChangeText={Text => setUpdate({...update, updateEmail: Text})}
            placeholder="Email"
            className='w-full bg-transparent'
            textColor='#000000'
            disabled={!edit}
            left={<TextInput.Icon icon="email" />}
            underlineColor='#FF4200'
        />
        
        {edit && (
                <Button onPress={handleEditDOB}>Edit Date Of Birth</Button>
            )}

            <TextInput
                mode="flat"
                label="Date of Birth"
                value={edit 
                    ? (update.updateDateOfBirth ? update.updateDateOfBirth.toLocaleDateString() : 'No Date Selected') 
                    : (data.success && data.data?.setProfile[0]?.Birth_Date 
                        ? new Date(data.data.setProfile[0].Birth_Date).toLocaleDateString() 
                        : 'Loading...')}
                onChangeText={Text => setUpdate({...update, updateDateOfBirth: new Date(Text)})}
                placeholder="Enter Date of Birth"
                disabled={!edit}
                className='w-full bg-transparent'
                textColor='#000000'
                left={<TextInput.Icon icon="calendar" />}
                underlineColor='#FF4200'
            />

            {/* DateTimePicker for Date of Birth */}
            <DateTimePicker
                isVisible={isVisible}
                mode="date"
                date={date}
                onConfirm={handleConfirm}
                onCancel={() => setIsVisible(false)}
            />

            <TextInput
                mode="flat"
                label="Profession"
                value={edit ? update.profession : (data.success && data.data?.setProfile[0]?.Profession ? data.data.setProfile[0].Profession : 'Loading...')}
                onChangeText={Text => setUpdate({...update, profession: Text})}
                placeholder="Profession"
                className='w-full bg-transparent'
                textColor='#000000'
                disabled={!edit}
                left={<TextInput.Icon icon="briefcase" />}
                underlineColor='#FF4200'
            />

            <TextInput
                mode="flat"
                label="License Number"
                value={edit ? update.license_number : (data.success && data.data?.setProfile[0]?.License_Number ? data.data.setProfile[0].License_Number : 'Loading...')}
                onChangeText={Text => setUpdate({...update, license_number: Text})}
                placeholder="License Number"
                className='w-full bg-transparent'
                textColor='#000000'
                disabled={!edit}
                left={<TextInput.Icon icon="card" />}
                underlineColor='#FF4200'
            />

            <TextInput
                mode="flat"
                label="Specialization"
                value={edit ? update.specialization : (data.success && data.data?.setProfile[0]?.Specialization ? data.data.setProfile[0].Specialization : 'Loading...')}
                onChangeText={Text => setUpdate({...update, specialization: Text})}
                placeholder="Specialization"
                className='w-full bg-transparent'
                textColor='#000000'
                disabled={!edit}
                left={<TextInput.Icon icon="pencil" />}
                underlineColor='#FF4200'
            />

        {edit && (
                <Button onPress={handleEditDOB2}>Add License Expiration Date</Button>
            )}

            <TextInput
                mode="flat"
                label="License Expiry Date"
                value={edit 
                    ? (update.license_expiry_date ? update.license_expiry_date.toLocaleDateString() : 'No Date Selected') 
                    : (data.success && data.data?.setProfile[0]?.License_Expiry_Date 
                        ? new Date(data.data.setProfile[0].License_Expiry_Date).toLocaleDateString() 
                        : 'Loading...')}
                onChangeText={Text => setUpdate({...update, license_expiry_date: new Date(Text)})}
                placeholder="License Expiry Date"
                disabled={!edit}
                className='w-full bg-transparent'
                textColor='#000000'
                left={<TextInput.Icon icon="calendar" />}
                underlineColor='#FF4200'
            />

            {/* DateTimePicker for License Expiry Date */}
            <DateTimePicker
                isVisible={isVisible2}
                mode="date"
                date={date2}
                onConfirm={handleConfirm2}
                onCancel={() => setIsVisible2(false)}
            />

        </View>

        {edit && (
            <View className='flex flex-row justify-end pt-5'>
            <Button
                className='pr-6 rounded-sm'
                textColor='gray'
                onPress={exitEdit}  
            >
                Save
            </Button>
            <Button
                className='pr-6 rounded-sm'
                textColor='gray'
                onPress={cancelEdit}  
            >
                Cancel
            </Button>
        </View>
        )}


      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.container}>
            <Text className='text-lg text-center pt-3 font-black'>Change Profile Picture</Text>
            <View className='flex flex-row gap-3 items-center justify-around p-7'>
                <TouchableOpacity className=' flex flex-col items-center'>                    
                    <IconButton icon="camera" size={30} iconColor='#FADC12' 
                    className='-top-2 rounded-md'
                    onPress={uploadImage}
                    />
                    <Text className='text-xs text-black font-semibold' onPress={uploadImage}>camera</Text>
                </TouchableOpacity>

                <TouchableOpacity className=' flex flex-col items-center'>                    
                    <IconButton icon="image" size={30} iconColor='#2938DA' 
                    className='-top-2  rounded-md'
                    onPress={uploadImageFromFiles}
                    />
                    <Text className='text-xs text-black font-semibold' onPress={uploadImageFromFiles}>upload image</Text>
                </TouchableOpacity>

                <TouchableOpacity className=' flex flex-col items-center'>                    
                    <IconButton icon="trash-can" size={30} iconColor='#ff4200' 
                    className='-top-2 rounded-md'
                    onPress={clearImage}
                    />
                    <Text className='text-xs text-black font-semibold' onPress={clearImage}>remove</Text>
                </TouchableOpacity>
            </View>
        </Modal>
      </Portal>

    </ScrollView>
    </PaperProvider>
    </>
  )
}

export default ManageProfile

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        marginHorizontal: 20,
    }
})