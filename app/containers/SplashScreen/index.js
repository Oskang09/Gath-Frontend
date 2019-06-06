import React from 'react';
import withFirebase from '#extension/firebase';
import withFeather from '#extension/feathers';

import { View, Text } from 'react-native';
import { compose } from '#utility';

export class SplashScreen extends React.PureComponent {
    
    checkAuth = async () => {
        if (this.props.firebaseUser) {
            const firebaseUser = this.props.firebaseUser;
            try {
                await this.props.socket.authenticate({ token: await firebaseUser.getIdToken() }, 'custom');
                this.props.navigation.navigate('home'); 
            } catch (error) {
                this.props.navigation.navigate('login'); 
            }
        } else {
            this.props.navigation.navigate('login'); 
        }
    }

    render() {
        this.checkAuth();
        return (
            <View>
                <Text>Loading</Text> 
            </View>
        );
    }
};

export default compose(
    withFirebase,
    withFeather
)(SplashScreen);