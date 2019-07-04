import React, { createRef } from 'react';

import withFirebase from '#extension/firebase';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import { compose } from '#utility';
import Stepper from '#components/Stepper';
import Form from '#components/Form';

import { View } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import Confirm from 'react-native-confirmation-code-field';
import Icon from 'react-native-vector-icons/Entypo';

export class PhoneNumber extends React.PureComponent {
    state = {
        phone: '+60187824152',
        code: '',
        confirmCode: null,
        error: null,
        loading: false,
    }

    formSetting = () => [
        {
            type: 'input',
            dcc: (phone) => this.setState({ phone }),
            inputProps: {
                disabled: this.state.confirmCode,
                mode: 'outlined',
                width: 200,
            },
            setting: {
                key: 'Phone Number',
                value: this.state.phone,
            }
        },
    ];

    input = createRef();

    verifyPhone = async () => {
        this.setState({ loading: true, error: null });
        try {
            this.setState({
                confirmCode: await this.props.firebase.login(this.state.phone),
                loading: false,
            });
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }

    verifyCode = async (input) => {
        this.setState({ loading: true, error: null });
        try {
            const firebaseUser = await this.state.confirmCode.confirm(input);
            this.props.api.setToken(await firebaseUser.getIdToken(true));
            const apiUser = await this.props.api.request('POST', `/users/${firebaseUser.uid}`, { phone: this.state.phone });
            if (apiUser.status === 'NEW') {
                this.props.navigation.navigate('detail');
            } else {
                this.props.navigation.navigate('home');
            }
        } catch (error) {
            this.input.current.clear();
            this.setState({ error: error.message, loading: false });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center', 
                    alignItems: 'center'
                }}>
                    <View width={this.props.device.getX(65)} style={{ alignItems: 'center' }}>
                        <Form formSetting={this.formSetting()} />
                        {
                            this.state.confirmCode 
                            ? 
                                <Confirm
                                    ref={this.input}
                                    onFulfill={this.verifyCode}
                                    keyboardType="numeric"
                                    codeLength={6}
                                    containerProps={{
                                        style: {
                                            marginTop: this.props.device.getY(7)
                                        }
                                    }}
                                />
                            :
                                <View style={{ marginTop: this.props.device.getY(3) }}>
                                    <Button mode="contained" onPress={this.verifyPhone}>
                                        <Text style={{ color: 'white' }}>TAC</Text>
                                    </Button>
                                </View>
                        }
                    </View>
                    <View style={{ marginTop: this.props.device.getY(10) }}>
                        {
                            this.state.loading && 
                            <ActivityIndicator size="small" animating={true}  />
                        }
                        {
                            this.state.error &&
                            <Text>{ this.state.error }</Text>
                        }
                    </View>
                </View>
                <Stepper
                    containerStyle={{
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end', 
                        flexDirection: 'row'
                    }}
                    currentStep={1}
                    maxSteps={5}
                    activeStep={<Icon name="dot-single" size={30} color="#672EDF" />}
                    inactiveStep={<Icon name="dot-single" size={30} color="#000000" />}
                />
            </View>
        );
    }
};

export default compose(
    withFirebase,
    withDevice,
    withAPI,
)(PhoneNumber);