import { RefreshControl, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, HelperText, IconButton, TextInput } from 'react-native-paper';
import { useAppNavigation } from '../utils/useAppNaviagtion';
import axios from 'axios';

const ManagePassword = () => {
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useAppNavigation();
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const passwordsMatch = () => newPassword === confirmPassword;

    const isPasswordValid = (password: string) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    };

    const handleSavePassword = async () => {
        setRefreshing(true);

        if (!passwordsMatch()) {
            ToastAndroid.showWithGravityAndOffset(
                'New password and confirm password do not match.',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
            return;
        }
        if (!isPasswordValid(newPassword)) {
            ToastAndroid.showWithGravityAndOffset(
                'New password is too weak.',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
            return;
        }

        try {
            const response = await axios.post('https://2738-136-158-2-21.ngrok-free.app/my_api/changePassword.php', {
                currentPassword,
                newPassword,
                confirmPassword
            });
            console.log("API Response:", response.data)
            if (response.data.success) {
                ToastAndroid.showWithGravityAndOffset(
                    'Changed Password Successfully!',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                );

                navigation.goBack();
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
        setRefreshing(false);
        }
    };

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            style={{ padding: 10 }}
        >
            <View className='rounded-b-lg max-h-20 h-full flex flex-row justify-between items-center pt-5'>
                <IconButton
                    icon="keyboard-backspace"
                    size={30}
                    iconColor='#000000'
                    onPress={navigation.goBack}
                />
                <Text className='text-lg text-black text-center'>Manage Password</Text>
                <Avatar.Icon icon={''} className='bg-transparent'/>
            </View>

            <View className='flex flex-col gap-2 items-center px-10 pt-5 mt-20'>

                <TextInput
                    mode="flat"
                    label="Current Password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Current Password"
                    className='w-full bg-transparent'
                    secureTextEntry={!showCurrent}
                    textColor='#000000'
                    right={
                        <TextInput.Icon
                            icon={showCurrent ? "eye-off" : "eye"}
                            onPress={() => setShowCurrent(!showCurrent)}
                        />
                    }
                    left={<TextInput.Icon icon="lock" />}
                    underlineColor='#FF4200'
                />
                
                <TextInput
                    mode="flat"
                    label="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                    className='w-full bg-transparent'
                    secureTextEntry={!showNew}
                    textColor='#000000'
                    right={
                        <TextInput.Icon
                            icon={showNew ? "eye-off" : "eye"}
                            onPress={() => setShowNew(!showNew)}
                        />
                    }
                    left={<TextInput.Icon icon="lock-outline" />}
                    underlineColor='#FF4200'
                />

                <TextInput
                    mode="flat"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password"
                    className='w-full bg-transparent'
                    secureTextEntry={!showConfirm}
                    textColor='#000000'
                    right={
                        <TextInput.Icon
                            icon={showConfirm ? "eye-off" : "eye"}
                            onPress={() => setShowConfirm(!showConfirm)}
                        />
                    }
                    left={<TextInput.Icon icon="lock-outline" />}
                    underlineColor='#FF4200'
                />

                {!passwordsMatch() && (
                    <HelperText type="error" visible>
                        New password and confirm password do not match!
                    </HelperText>
                )}

                {!isPasswordValid(newPassword) && (
                    <HelperText type="error" visible className="text-center">
                        Password should be at least 8 characters long, with at least 1 capital letter and 1 number!
                    </HelperText>
                )}
            </View>

            <View className='flex flex-col gap-2 items-center px-10 pt-10'>
                <Button
                    mode='outlined'
                    className='rounded-md w-full mt-4 bg-[#FF4200]'
                    textColor='#FFFFFF'
                    onPress={handleSavePassword}
                >
                    Save
                </Button>
            </View>
        </ScrollView>
    );
};

export default ManagePassword;

const styles = StyleSheet.create({});
