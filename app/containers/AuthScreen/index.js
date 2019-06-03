import React from 'react';
import PropTypes from 'prop-types';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default class AuthScreen extends React.PureComponent {

    render() {
        return (
            <MapView
                style={{flex: 1}}
                provider={PROVIDER_GOOGLE}
                region={{
                    latitude: 42.882004,
                    longitude: 74.582748,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
                showsUserLocation={true}
            />
        );
    }
};

AuthScreen.propTypes = {

};