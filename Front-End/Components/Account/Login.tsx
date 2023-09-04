import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useUser } from '../UserContext/UserContext'; // Import the useUser hook
import Register from './Register'; // Import the Register component

const Login: React.FC = () => {
  const { loggedIn, login, logout } = useUser(); // Use the loggedIn and login functions from the context
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null); // State to store login error message

  const handleLogin = async () => {
    try {
      // Send a POST request to the server with the login credentials
      const response = await fetch('http://movie-review-app-ruby.vercel.app/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const user = await response.json();
        // Call the login function with both userID and username
        login(user.id, user.username); // Modify this line
      } else {
        // Handle login failure by setting error message
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      // Handle network error or other issues
      console.error('Login error:', error);
      setLoginError('An error occurred while logging in');
    }
  };

  const handleLogout = () => {
    // Simulate a logout process
    logout();
  };

  return (
    <View style={styles.container}>
      {loggedIn ? (
        // Display username and logout button if logged in
        <>
          <Text style={styles.title}>Welcome, {username}!</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Display login and register fields if not logged in
        <>
          <Text style={styles.title}>Login</Text>
          {loginError && <Text style={styles.errorText}>{loginError}</Text>}
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerButton} onPress={() => setShowRegisterModal(true)}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </>
      )}

      {/* The Register modal */}
      <Modal
        visible={showRegisterModal}
        animationType="slide"
        onRequestClose={() => setShowRegisterModal(false)}
      >
        {/* Render the Register component inside the modal */}
        <Register onClose={() => setShowRegisterModal(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: 'red',
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

export default Login;
