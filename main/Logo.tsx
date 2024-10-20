import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../images/image.png')} style={styles.image} />
        <Text style={styles.logo}>
        <Text style={styles.logo1}>SMTC </Text>
        <Text style={styles.logo2}>Dental </Text>
        <Text style={styles.logo3}>Care</Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100, 
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      logo1: {
        color: '#ff4200', 
      },
      logo2: {
        color: '#2938DA', 
      },
      logo3: {
        color: '#2938DA', 
      },
})

export default Logo