import React from 'react';

import withFirebase from '#extension/firebase';
import withPixel from '#extension/device';
import withAPI from '#extension/apisauce';
import { compose } from '#utility';
import Stepper from '#components/Stepper';
import UserInput from '#components/UserInput';

import { View, TouchableOpacity } from 'react-native';
import { TextInput, Text, Colors, List } from 'react-native-paper';
import Confirm from 'react-native-confirmation-code-field';
import Icon from 'react-native-vector-icons/Entypo';

export class PhoneNumber extends React.PureComponent {
    state = {
        phone: '+60187824152',
        code: '',
        confirmCode: null,
        loading: false,
        error: null,
    }

    verifyPhone = async () => {
        try {
            this.setState({
                confirmCode: await this.props.firebase.login(this.state.phone)
            });
        } catch (error) {
            this.setState({ error });
        }
    }

    verifyCode = async (input) => {
        try {
            const firebaseUser = await this.state.confirmCode.confirm(input);
            const apiUser = await this.props.api.request('GET', `/users/${firebaseUser.uid}`);
            if (apiUser.ok) {
                this.props.navigation.navigate('home');
            } else {
                this.props.navigation.navigate('detail');
            }
        } catch (error) {
            this.setState({ error });
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Colors.green100
            }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center', 
                    alignItems: 'center'
                }}>
                    <View width={this.props.device.getX(65)}>
                        <Text>Enter phone number</Text>
                        <TextInput
                            value={this.state.phone}
                            disabled={this.state.confirmCode}
                            onChangeText={phone => this.setState({ phone })}
                        />
                        {
                            this.state.confirmCode 
                            ? 
                                <Confirm
                                    onFulfill={this.verifyCode}
                                    keyboardType="numeric"
                                    codeLength={6}
                                    containerProps={{
                                        style: {
                                            alignItems: 'center',
                                            marginTop: this.props.device.getY(7)
                                        }
                                    }}
                                />
                            :
                                <View style={{ alignItems: 'center', marginTop: this.props.device.getY(3) }}>
                                    <TouchableOpacity onPress={this.verifyPhone}>
                                        <Text>TAC</Text>
                                    </TouchableOpacity>
                                </View>
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
    withPixel,
    withAPI,
)(PhoneNumber);