import { useState } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import Dashboard from '../tabs/Dashboard';
import Appointment from '../tabs/Appointment';
import Profile from '../tabs/Profile';
import RecordAppointment from '../tabs/RecordDetails';
import { StyleSheet, View } from 'react-native';

const DashboardRoute = () => <Dashboard/>;

const AppointmentRoute = () => <Appointment/>;

//const RecordRoute = () => <RecordAppointment/>;

const ProfileRoute = () => <Profile/>;

const useNavigationBar = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'dashboard', title: 'Dashboard', focusedIcon: 'view-dashboard', unfocusedIcon: 'view-dashboard-outline'},
    { key: 'appointment', title: 'Appointment', focusedIcon: 'calendar' },
    //{ key: 'Record', title: 'Record', focusedIcon: 'clipboard-text-multiple-outline' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account-circle' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: DashboardRoute,
    appointment: AppointmentRoute,
    //Record: RecordRoute,
    profile: ProfileRoute,
  });
  

  return (
      <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor="#000000"
      inactiveColor="#000000" 
      barStyle={styles.barStyle}
    />

  );
};

const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: '#FF4200',
    
  },
});

export default useNavigationBar;