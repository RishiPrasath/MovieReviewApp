import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { RegisterProps } from './types'; // Import the type for RegisterProps

const Register: React.FC<RegisterProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleUsernameChange = (text: string) => {

    // trim off any whitespace from the left and right sides of the string
    text = text.trim();

    console.log('Username:', text);

    setUsername(text);
  };

  const handlePasswordChange = (text: string) => {

    // trim off any whitespace from the left and right sides of the string
    text = text.trim();

    console.log('Password:', text);
    

    setPassword(text);
  };

  const handleRegister = async () => {
    console.log('Registering user:', username, password);
    try {
      const response = await fetch(`http://movie-review-app-ruby.vercel.app/account/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        // Registration successful, you can handle the success scenario here
        onClose(); // Close the registration modal
      } else {
        // Registration failed, handle error scenario
        const errorData = await response.json();
        console.log('Registration error:', errorData.message);
        // You can display an error message to the user here
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
      // You can display a network error message to the user here
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {/* ... other input fields */}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={handleUsernameChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  registerButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Register;
