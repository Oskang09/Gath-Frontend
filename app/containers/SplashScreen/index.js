import React from 'react';
import withFirebase from '#extension/firebase';
import withAPI from '#extension/apisauce';

import { View, Text } from 'react-native';
import { compose } from '#utility';

export class SplashScreen extends React.PureComponent {
    
    checkAuth = async () => {
        const firebaseUser = this.props.firebase.getUser();
        if (firebaseUser) {
            this.props.api.setToken(await firebaseUser.getIdToken());
            this.props.navigation.navigate('detail');
        } else {
            this.props.navigation.navigate('detail'); 
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
    withAPI
)(SplashScreen);