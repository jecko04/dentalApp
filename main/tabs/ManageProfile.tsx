import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IconButton, Divider, Avatar, Button, TextInput, Modal, PaperProvider, Portal} from 'react-native-paper';
import { useAppNavigation } from '../utils/useAppNaviagtion';
import axios from 'axios';
import * as ImagePicker from "expo-image-picker";

const ManageProfile = () => {

    const navigation = useAppNavigation();
    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const [image, setImage] = useState();
    const containerStyle = {backgroundColor: 'white',
        padding: 20,
    };

    const [data, setData] = useState({
        success: false,
        data: {
        name: null,
        name2: null,
        email: null,
        password: null,
        },
    });

    const fetchData = async () => {
        try{
            const response = await axios.get('http://192.168.100.40/my_api/profile.php');
            setData(response.data);
            console.log("API Response:", response.data);
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData();
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

    const saveImage = async (image: any) => {
        try {
            setImage(image);
            setVisible(false);
        }
        catch (error) {
            throw error;
        }
    }


  return (
    <>
    <PaperProvider>
    <View className='rounded-b-lg max-h-20 h-full flex flex-row justify-between items-center pt-5'>
            <IconButton icon="keyboard-backspace" size={30} iconColor='#000000' 
            onPress={
            navigation.goBack
            }/>
            <Text className='text-lg text-black'>Manage Profile</Text>
            <IconButton icon="square-edit-outline" size={30} iconColor='#000000' 
            onPress={
            navigation.goBack
            }/>
    </View>
    
    <View className='flex flex-row gap-2 items-center px-8 pt-5'>        
            <Avatar.Image size={80} source={image ? { uri: image } : require('../images/avatar.jpg')}/>
        <View className='flex flex-col justify-start items-start'>
            <Text className='text-xs pl-3 pt-3' style={{ color: "#000000" }}>
            {data.success && data.data?.name ? data.data.name : 'Loading...'}
            </Text>
            <Button className='' 
            textColor='#000000'
            icon="camera"
            onPress={showModal}
            >
                Change profile
            </Button>
        </View>
    </View>

    <View className='flex flex-col gap-2 items-center px-10 pt-5 mt-20'>        
        <TextInput
          mode="flat"
          label="Fullname"
          value={data.success && data.data?.name2 ? data.data.name2 : 'Loading...'}
          
          placeholder="Fullname"
          className='w-full bg-transparent'
          textColor='#000000'
          disabled={true}
          left={<TextInput.Icon icon="account" />}
          underlineColor='#FF4200'
        />
        <TextInput
          mode= "flat"
          label="Email"
          value={data.success && data.data?.email ? data.data.email : 'Loading...'}
          placeholder="Email"
          className='w-full bg-transparent'
          textColor='#000000'
          disabled={true}
          left={<TextInput.Icon icon="email" />}
          underlineColor='#FF4200'
        />
    </View>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.container}>
            <Text className='text-lg text-center pt-3 font-black'>Profile Picture</Text>
            <View className='flex flex-row gap-3 items-center justify-around p-7'>
                <View className='bg-gray-200 rounded-md flex flex-col items-center'>
                    <IconButton icon="camera" size={30} iconColor='#FADC12' 
                    className='-top-2'
                    />
                    <Text className='text-xs text-black absolute bottom-2'>camera</Text>
                </View>
                <View className='bg-gray-200 rounded-md flex flex-col items-center'>
                    <IconButton icon="image" size={30} iconColor='#2938DA' 
                    className='-top-2'
                    />
                    <Text className='text-xs text-black absolute bottom-2'>camera</Text>
                </View>
                <View className='bg-gray-200 rounded-md flex flex-col items-center'>
                    <IconButton icon="trash-can" size={30} iconColor='#FF4200' 
                    className='-top-2'
                    />
                    <Text className='text-xs text-black absolute bottom-2'>camera</Text>
                </View>
            </View>
        </Modal>
      </Portal>
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