import React from 'react';
import { View, Image } from 'react-native';

import Loading from '#components/Loading';
import withFirebase from '#extension/firebase';
import withAPI from '#extension/apisauce';
import withNavigator from '#extension/navigator';
import { compose } from '#utility';

export class SplashScreen extends React.PureComponent {
  
    state = {
        display: 'Loading ...',
    }

    componentWillMount() {
        this.checkAuthAndSetting().catch(
            () => this.setState({ display: 'No internet, please re-open application.' })
        );
    }

    checkAuthAndSetting = async () => {
        const { api, firebase, navigator } = this.props;
        this.setState({ display: 'Checking local user data...' });
        const firebaseUser = await firebase.getUser();
        let user = null;
        if (!firebaseUser) {
            return navigator.switchTo('register');
        }
        
        api.setToken(await firebaseUser.getIdToken(true));
        this.setState({ display: 'Retrieving config from api server...' });
        await api.loadConfig();
        try {
            user = await api.request('GET', '/users/profile/me')
        } catch (error) {
            return navigator.switchTo('register');
        }

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

        const initial = await this.props.firebase.initialNotify();
        if (initial) {
            const { data } = initial.notification;
            const response = await api.request('GET', `/events/${data.event}`);
            if (data.action === 'VIEW_EVENT') {
                return navigator.pushMultiple('home', {
                    routeName: 'event_detail',
                    params: response,
                });
            }
            if (data.action === 'REVIEW') {
                return navigator.pushMultiple('home', {
                    routeName: 'review',
                    params: response,
                });
            }
        }
        
        if (user.status === 'NEW') {
            return navigator.switchTo('detail');
        }
        if (user.status === 'REGISTERED') {
            return navigator.switchTo('home');
        }
    }

    render() {
        return <Loading content={this.state.display} />;
    }
};

export default compose(
    withFirebase,
    withAPI,
    withNavigator,
)(SplashScreen);