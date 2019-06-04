import React from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Firebase from 'react-native-firebase';
import Feather, { FeatherSocket } from 'feathersjs-sdk';
import AppSingleton from 'util/singleton';

export default class SplashScreen extends React.PureComponent {
    
    initialise = () => {
        AppSingleton.feathers = new Feather({
            transport: {
                default: new FeatherSocket({
                    storage: AsyncStorage,
                    use: 'websocket',
                    host: 'http://192.168.56.1:3000',
                    connect: () => {},
                    disconnect: () => {},
                })
            }
        });
        AppSingleton.authenticate = Firebase.auth();
        AppSingleton.user = AppSingleton.authenticate.currentUser;
        setTimeout(() => {
            if (AppSingleton.user) {
                this.props.navigation.navigate('main');
            } else {
               this.props.navigation.navigate('login');
            }
        }, 3000);
    }

    render() {
        this.initialise();
        return (
            <View>
                <Text>Loading</Text> 
            </View>
        );
    }
};

SplashScreen.propTypes = {

};