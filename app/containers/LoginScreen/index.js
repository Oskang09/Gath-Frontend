import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';

import { compose } from 'util/utility';
import { withSnackbar } from 'extension/snackbar';

export class LoginScreen extends React.PureComponent {
    render() {
        return (
            <View>
                <Card.Title
                    title="Card Title"
                    subtitle="Card Subtitle"
                    right={(props) => 
                    <Text 
                        onPress={
                            () => this.props.snackbar('test snack')
                        }
                    >
                        Click me
                    </Text>}
                />
            </View>
        );
    }
};

LoginScreen.propTypes = {

};

export default compose(
    withSnackbar
)(LoginScreen);