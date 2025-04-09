import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons  from  '@react-native-vector-icons/ionicons'

const CustomToast = ({ text1, text2, type, hide }) => {
  const isSuccess = type === 'success';

  return (
    <View style={[styles.toastContainer, isSuccess ? styles.success : styles.error]}>
      <Ionicons
        name={isSuccess ? 'checkmark-circle-outline' : 'close-circle-outline'}
        size={24}
        color="#fff"
        style={{ marginRight: 8 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.text1}>{text1}</Text>
        {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
      </View>
      <TouchableOpacity onPress={hide}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 40,
    elevation: 5,
  },
  success: {
    backgroundColor: '#4BB543',
  },
  error: {
    backgroundColor: '#FF3E3E',
  },
  text1: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text2: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
});

export default CustomToast;
