import React from 'react';
import withFirebase from '#extension/firebase';
import withAPI from '#extension/apisauce';

import { View, Text } from 'react-native';
import { compose } from '#utility';

export class SplashScreen extends React.PureComponent {
    
    checkAuthAndSetting = async () => {
        const { navigation, api, firebase } = this.props;
        navigation.navigate('home');
        // await api.getServerConfig();
        // const firebaseUser = await firebase.getUser();
        // if (firebaseUser) {
        //     api.setToken(await firebaseUser.getIdToken());
        //     navigation.navigate('register');
        // } else {
        //     navigation.navigate('register'); 
        // }
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