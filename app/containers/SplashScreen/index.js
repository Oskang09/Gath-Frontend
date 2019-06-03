import React from 'react';
import { AsyncStorage, View } from 'react-native';
import PropTypes from 'prop-types';
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// import Firebase from 'react-native-firebase';
import Feather, { FeatherSocket } from 'feathersjs-sdk';
import AppSingleton from '../../util/singleton';

export default class AuthScreen extends React.PureComponent {
    
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
        // AppSingleton.authenticate = Firebase.auth();
        // AppSingleton.user = AppSingleton.authenticate.currentUser;
        // AppSingleton.authenticate().onAuthStateChanged(
        //     (user) => {
        //         this.props.navigation.navigate(user ? 'home' : 'login');
        //         AppSingleton.user = user;
        //     }
        // );
    }

    render() {
        this.initialise();
        return (
            <View>
                <Text>ABC</Text>
            </View>
        );
    }
};

AuthScreen.propTypes = {

};