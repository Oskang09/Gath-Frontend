import React, { createRef } from 'react';
import { View } from 'react-native';
import { Text, ActivityIndicator, Button, Card, Appbar } from 'react-native-paper';
import Confirm from 'react-native-confirmation-code-field';

import withFirebase from '#extension/firebase';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import withError from '#extension/error';

import { compose } from '#utility';
import Form from '#components/Form';

export class PhoneNumber extends React.PureComponent {
    state = {
        phone: '+60187824152',
        code: '',
        confirmCode: null,
        loading: false,
    }
    confirmRef = createRef()

    formSetting = () => [
        {
            type: 'input',
            row: 0,
            dcc: (phone) => this.setState({ phone }),
            props: {
                disabled: this.state.confirmCode,
                mode: 'outlined',
                width: this.props.device.getX(45),
            },
            setting: {
                key: 'phone-number',
                value: this.state.phone,
            }
        },
    ];

    verifyPhone = async () => {
        this.setState({ loading: true });
        try {
            this.setState({
                confirmCode: await this.props.firebase.login(this.state.phone),
                loading: false,
            }, () => this.confirmRef.current.focus());
        } catch (error) {
            this.props.showError(error.message);
            this.setState({ loading: false });
        }
    }

    verifyCode = async (input) => {
        this.setState({ loading: true, error: null });
        try {
            const firebaseUser = await this.state.confirmCode.confirm(input);
            this.props.api.setToken(await firebaseUser.getIdToken(true));
            const { ok, result, message } = await this.props.api.request('POST', `/users/login`, { phone: this.state.phone, uid: firebaseUser.uid });
            if (ok) {
                if (result.status === 'NEW') {
                    this.props.navigation.navigate('detail');
                } else if (result.status === 'MEMBER') {
                    this.props.navigation.navigate('home');
                }
            } else {
                this.confirmRef.current.clear();
                this.props.showError(message);
                this.setState({ loading: false });
            }
        } catch (error) {
            this.confirmRef.current.clear();
            this.props.showError(error.message);
            this.setState({ loading: false });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar>
                    <Appbar.Content title="Gath" />
                </Appbar>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Enter your phone number</Text>
                    <Form
                        formSetting={this.formSetting()}
                        containerStyle={{ alignItems: 'center' }}
                        rowStyle={{ flexDirection: 'row', margin: 5 }}
                    />
                    {
                        !this.state.confirmCode && (
                            <View style={{ marginTop: this.props.device.getY(3) }}>
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
    withError
)(PhoneNumber);