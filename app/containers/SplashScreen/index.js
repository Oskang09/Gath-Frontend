import React from 'react';
import withFirebase from '#extension/firebase';

import { View, Text } from 'react-native';
import { compose } from '#utility';

export class SplashScreen extends React.PureComponent {
    
    initialise = () => {
        setTimeout(() => {
            if (this.props.user) {
                this.props.navigation.navigate('main');
            } else {
                // this.props.navigation.navigate('main');
                this.props.navigation.navigate('login');
            }
        }, 1000);
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

export default compose(
    withFirebase
)(SplashScreen);