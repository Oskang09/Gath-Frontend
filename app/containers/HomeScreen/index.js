import React from 'react';
import PropTypes from 'prop-types';
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View, Text } from 'react-native';
import { compose } from '#utility';

export class HomeScreen extends React.PureComponent {
    static navigationOptions = {
        title: 'Home Title'
    };

    render() {
        return (
            <View>
                <Text>Here is home</Text>
            </View>
        );
    }
};

export default compose(

)(HomeScreen);