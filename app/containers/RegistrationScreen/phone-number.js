import React, { createRef } from 'react';
import { View } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import PhoneInput from 'react-native-phone-input';
import Confirm from 'react-native-confirmation-code-field';

import Appbar from '#components/Appbar';
import withFirebase from '#extension/firebase';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import withNavigator from '#extension/navigator';
import withDialog from '#extension/dialog';

import { compose } from '#utility';

export class PhoneNumber extends React.PureComponent {
    state = {
        code: '',
        confirmCode: null,
        loading: false,
    }
    phoneRef = null
    confirmRef = createRef()

    verifyPhone = async () => {
        this.setState({ loading: true });
        try {
            if (!this.phoneRef.isValidNumber()) {
                throw Error("Invalid phone number.");
            }

            this.setState({
                confirmCode: await this.props.firebase.login(this.phoneRef.getValue()),
                loading: false,
            }, () => this.confirmRef.current.focus());
        } catch (error) {
            this.setState({ loading: false }, () => this.props.showDialog(error.message));
        }
    }

    verifyCode = async (input) => {
        this.setState({ loading: true, error: null });
        try {
            const firebaseUser = await this.state.confirmCode.confirm(input);
            
            this.props.api.setToken(await firebaseUser.getIdToken(true));
            const result = await this.props.api.request('POST', `/users/login`, { phone: this.phoneRef.getValue(), uid: firebaseUser.uid });
            if (result.status === 'NEW') {
                this.props.navigator.switchTo('detail');
            } else if (result.status === 'REGISTERED') {
                this.props.navigator.switchTo('splash');
            }
        } catch (error) {
            this.confirmRef.current.clear();
            this.setState({ loading: false }, () => this.props.showDialog(error.message));
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar eventTrack={false} /> 
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Enter your phone number</Text>
                    <PhoneInput
                        allowZeroAfterCountryCode={false}
                        disabled={this.state.confirmCode}
                        ref={ref => this.phoneRef = ref}
                        style={{
                            width: this.props.device.getX(65),
                            alignSelf: 'center',
                            margin: 20,
                        }}
                        initialCountry="my"
                        onPressFlag={() => {}}
                    />
                    {
                        !this.state.confirmCode && (
                            <View>
                                <Button mode="contained" onPress={this.verifyPhone}>
                                    <Text style={{ color: 'white' }}>REQUEST FOR TAC</Text>
                                </Button>
                            </View>
                        )
                    }
                    {
                        this.state.confirmCode && (
                            <Confirm
                                ref={this.confirmRef}
                                onFulfill={this.verifyCode}
                                keyboardType="numeric"
                                activeColor={this.props.device.primaryColor}
                                inactiveColor={this.props.device.primaryColor}
                                codeLength={6}
                                containerProps={{
                                    style: {
                                        flex: 0,
                                        marginTop: this.props.device.getY(3)
                                    }
                                }}
                                cellProps={{
                                    style: {
                                        color: 'black',
                                        fontSize: 17
                                    }
                                }}
                            />
                        )
                    }
                    {
                        this.state.loading && (
                            <View style={{ marginTop: this.props.device.getY(3) }}>
                                <ActivityIndicator size="small" animating={true}  />
                            </View>
                        )
                    }
                </View>
            </View>
        );
    }
};

export default compose(
    withFirebase,
    withDevice,
    withAPI,
    withNavigator,
    withDialog
)(PhoneNumber);