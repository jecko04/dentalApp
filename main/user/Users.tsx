import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import NavigationBar from '../utils/useNavigationBar';

const Home = () => {
  return (
    <View style={styles.container}>
      <NavigationBar/>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default Home