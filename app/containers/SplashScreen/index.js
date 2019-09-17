import React from 'react';
import { View, Text } from 'react-native';

import withFirebase from '#extension/firebase';
import withAPI from '#extension/apisauce';
import withNavigator from '#extension/navigator';
import { compose } from '#utility';

export class SplashScreen extends React.PureComponent {
    
    checkAuthAndSetting = async () => {
        const { api, firebase, navigator } = this.props;
        const firebaseUser = await firebase.getUser();
        
        if (!firebaseUser) {
            return navigator.switchTo('register');
        }
        api.setToken(await firebaseUser.getIdToken());
        await api.loadConfig();
        await firebase.initialize(
            async function (message) {
                const { data } = message.notification;
                const response = await api.request('GET', `/events/${data.event}`);
                if (data.action === 'VIEW_EVENT') {
                    navigator.push({
                        routeName: 'event_detail',
                        params: response,
                    });
                }
                if (data.action === 'REVIEW') {
                    navigator.push({
                        routeName: 'review',
                        params: response,
                    });
                }
            },
            function (token) {
                return api.request('POST', '/users/profile', { device_token: token });
            }
        );

        try {
            const user = await api.request('GET', '/users/profile');
            if (user.status === 'NEW') {
                return navigator.switchTo('detail');
            }
            if (user.status === 'REGISTERED') {
                return navigator.switchTo('home');
            } 
        } catch (error) {
            return navigator.switchTo('register');
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
    withAPI,
    withNavigator,
)(SplashScreen);