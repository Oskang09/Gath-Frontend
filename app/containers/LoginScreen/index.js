import React from 'react';
import withFirebase from '#extension/firebase';
import withPixel from '#extension/device';
import withFeather from '#extension/feathers';

import { View } from 'react-native';
import { Avatar, TextInput, Button, Text } from 'react-native-paper';
import { compose } from '#utility';

export class LoginScreen extends React.PureComponent {
    state = {
        phone: '+60187824152',
        confirmCode: null,
        code: '',
        loading: false,
        error: null,
    }

    render() {
        const { loading, confirmCode, phone, code } = this.state;
        return (
            <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                <Avatar.Image
                    style={{ marginBottom: this.props.device.getY(10) }}
                    size={128}
                    source={require('#assets/icon.jpg')}
                />
                <View 
                    width={this.props.device.getX(65)}
                    style={{ marginBottom: this.props.device.getY(5) }}
                >
                    <TextInput
                        label='Phone Number'
                        value={phone}
                        disabled={confirmCode}
                        onChangeText={phone => this.setState({ phone })}
                    />
                </View>
                {
                    confirmCode && 
                    <View
                        width={this.props.device.getX(65)}
                        style={{ marginBottom: this.props.device.getY(5) }}
                    >
                        <TextInput
                            label='Confirm Code'
                            value={code}
                            onChangeText={code => this.setState({ code })}
                        />
                    </View>
                }
                <View>
                    <View
                        style={{
                            flexDirection: 'row'
                        }}
                    >
                        <Button
                            width={this.props.getX(35)}
                            mode="contained"
                            loading={this.state.loading}
                            onPress={async () => {
                                if (!loading) {
                                    if (!confirmCode) {
                                        if (!phone) {
                                            this.setState({
                                                error: `Error occurs: Empty phone number`,
                                                loading: false,
                                            });
                                        }
                                        this.setState({
                                            loading: true,
                                            error: null
                                        });
                                        try {
                                            this.setState({
                                                confirmCode: await this.props.firebase.login(phone),
                                                loading: false,
                                            });
                                        } catch (error) {
                                            console.info(error);
                                            this.setState({
                                                loading: false,
                                                error: `Error occurs: ${error.message}`
                                            });
                                        }
                                    } else if (confirmCode) {
                                        if (!code) {
                                            this.setState({
                                                error: `Error occurs: Empty verify code`,
                                                loading: false,
                                            });
                                        }
                                        this.setState({
                                            loading: true,
                                            error: null
                                        });
                                        try {
                                            await confirmCode.confirm(code);
                                            await this.props.feather.login({ token: await this.props.firebase.getUser().getIdToken() }, 'custom');
                                            this.props.navigation.navigate('home');
                                        } catch (error) {
                                            console.info(error);
                                            this.setState({
                                                loading: false,
                                                error: `Error occurs: ${error.message}`
                                            });
                                        }
                                    }
                                }
                            }}
                        >
                            {confirmCode ? 'Verify' : 'Login'}
                        </Button>
                    </View>
                    {
                        this.state.error && 
                        <Text>{this.state.error}</Text>
                    }
                </View>
            </View>
        );
    }
};

export default compose(
    withFirebase,
    withPixel,
    withFeather
)(LoginScreen);