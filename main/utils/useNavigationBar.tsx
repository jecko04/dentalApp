import { useState } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import Dashboard from '../tabs/Dashboard';
import Appointment from '../tabs/Appointment';
import Profile from '../tabs/Profile';
import { StyleSheet, View } from 'react-native';

const DashboardRoute = () => <Dashboard/>;

const AppointmentRoute = () => <Appointment/>;

const ProfileRoute = () => <Profile/>;

const useNavigationBar = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'dashboard', title: 'Dashboard', focusedIcon: 'view-dashboard', unfocusedIcon: 'view-dashboard-outline'},
    { key: 'appointment', title: 'Appointment', focusedIcon: 'calendar' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account-circle' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: DashboardRoute,
    appointment: AppointmentRoute,
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