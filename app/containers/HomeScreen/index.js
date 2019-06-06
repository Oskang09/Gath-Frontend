import React from 'react';
import withFirebase from '#extension/firebase';
import withFeather from '#extension/feathers';

// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View, Text } from 'react-native';
import { compose } from '#utility';
import { Button } from 'react-native-paper';

export class HomeScreen extends React.PureComponent {
    static navigationOptions = {
        title: 'Home Title'
    };

    render() {
        console.info(this.props.firebaseUser);
        console.info(this.props.featherUser);
        return (
            <View>
                <Text>Here is home</Text>
                <Button
                    width={100}
                    mode="contained"
                    onPress={async () => {
                        await this.props.logout();
                        await this.props.socket.logout();
                        this.props.navigation.navigate('login');
                    }}
                >
                    LOGOUT
                </Button>
            </View>
        );
    }
};

export default compose(
    withFirebase,
    withFeather
)(HomeScreen);