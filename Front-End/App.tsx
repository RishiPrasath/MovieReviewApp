import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TabNavigationParamList } from './types'; // Import the type

import Home from './Components/Home/Home';
import Search from './Components/Search/Search';
import Login from './Components/Account/Login';
import Review from './Components/Review/Review'; // Updated import

// Import UserProvider
import { UserProvider, useUser } from './Components/UserContext/UserContext';

const Tab = createBottomTabNavigator<TabNavigationParamList>();
const Stack = createStackNavigator();




// Define a custom theme for the NavigationContainer
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white', // Set your preferred background color here
  },
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap | undefined;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Account') {
            iconName = 'person';
          }

          return <Ionicons name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Account" component={Login} />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Review">
            {(props) => {
              const { route } = props;
              const { userID } = useUser(); // Obtain the userID from the useUser hook
              return (
                <Review
                  {...props}
                  route={route}
                  userID={userID}
                />
              );
            }}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
