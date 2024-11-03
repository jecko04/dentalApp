import { useState } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import Dashboard from '../tabs/Dashboard';
import Appointment from '../tabs/Appointment';
import Profile from '../tabs/Profile';
import RecordAppointment from '../tabs/RecordDetails';
import { StyleSheet, View } from 'react-native';
import Appointment2 from '../tabs/Appointment2';

const DashboardRoute = () => <Dashboard/>;

const MainBrnachRoute = () => <Appointment/>;
const SecondBranchRoute = () => <Appointment2/>;
const ProfileRoute = () => <Profile route={undefined}/>;

const useNavigationBar = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'dashboard', title: 'Dashboard', focusedIcon: 'view-dashboard', unfocusedIcon: 'view-dashboard-outline'},
    { key: 'mainbranch', title: 'Main Branch', focusedIcon: 'calendar' },
    { key: 'secondbranch', title: 'Second Branch', focusedIcon: 'calendar' },
    //{ key: 'Record', title: 'Record', focusedIcon: 'clipboard-text-multiple-outline' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account-circle' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: DashboardRoute,
    mainbranch: MainBrnachRoute,
    secondbranch: SecondBranchRoute,
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