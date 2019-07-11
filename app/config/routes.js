import React from 'react';
import { View } from 'react-native';

import SplashScreen from '#containers/SplashScreen';
import PhoneNumber from '#containers/RegistrationScreen/phone-number';
import UserDetail from '#containers/RegistrationScreen/user-details';
import Personality from '#containers/RegistrationScreen/personality';
import Badge from '#containers/RegistrationScreen/badge';
import EventScreen from '#containers/HomeScreen/event-screen';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default {
    _type: 'switch',
    _setting: {
        initialRouteName: 'splash',
        backBehavior: 'initialRoute'
    },
    splash: SplashScreen,
    home: {
        _type: 'material-bottom',
        _setting: {
            initialRouteName: 'event',
            backBehavior: 'none',
            lazy: true,
            labeled: false,
        },
        event: {
            screen: EventScreen,
            navigationOptions:  {
                tabBarLabel: 'Event',
                tabBarIcon: (
                    <View>
                        <MaterialIcon size={25} name="library-books" />
                    </View>
                ),
            }
        },
    },
    register: {
        _type: 'switch',
        _setting: {
            initialRouteName: 'phone',
            backBehavior: 'none'
        },
        phone: PhoneNumber,
        detail: UserDetail,
        personality: Personality,
        badge: Badge,
    },
};