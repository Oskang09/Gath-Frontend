import React from 'react';
import withFirebase from '#extension/firebase';
import withAPI from '#extension/apisauce';

import { View, Text } from 'react-native';
import { compose } from '#utility';

export class SplashScreen extends React.PureComponent {
    
    checkAuthAndSetting = async () => {
        const { navigation, api, firebase } = this.props;
        await api.loadConfig();
        const firebaseUser = await firebase.getUser();
        if (!firebaseUser) {
            return navigation.navigate('register');
        }

        api.setToken(await firebaseUser.getIdToken());
        
        try {
            const user = await api.request('GET', '/users/profile');
            if (user.status === 'NEW') {
                return navigation.navigate('detail');
            }
            if (user.status === 'REGISTERED') {
                return navigation.navigate('home');
            } 
        } catch (error) {
            return navigation.navigate('register');
        }
    }

    render() {
        this.checkAuthAndSetting();
        return (
            <View>
                <Text>Loading</Text> 
            </View>
        );
    }
};

export default compose(
    withFirebase,
    withAPI
)(SplashScreen);