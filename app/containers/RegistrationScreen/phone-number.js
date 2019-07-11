import React, { createRef } from 'react';
import { View } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import Confirm from 'react-native-confirmation-code-field';

import withFirebase from '#extension/firebase';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import { compose } from '#utility';
import Form from '#components/Form';
import ErrorDialog from '#components/ErrorDialog';

export class PhoneNumber extends React.PureComponent {
    state = {
        phone: '+60187824152',
        code: '',
        confirmCode: null,
        error: null,
        loading: false,
    }
    confirmRef = null

    formSetting = () => [
        {
            type: 'input',
            row: 0,
            dcc: (phone) => this.setState({ phone }),
            style: {
                disabled: this.state.confirmCode,
                mode: 'outlined',
                width: 200,
            },
            setting: {
                key: 'phone-number',
                label: 'Phone Number',
                value: this.state.phone,
            }
        },
    ];

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
            const { ok, result, message } = await this.props.api.request('POST', `/users/login`, { phone: this.state.phone, uid: firebaseUser.uid });
            if (ok) {
                if (result.status === 'NEW') {
                    this.props.navigation.navigate('detail');
                } else if (result.status === 'MEMBER') {
                    this.props.navigation.navigate('home');
                }
            } else {
                this.confirmRef.current.clear();
                this.setState({ error: message, loading: false });
            }
        } catch (error) {
            this.confirmRef.current.clear();
            this.setState({ error: error.message, loading: false });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ErrorDialog error={this.state.error} dismiss={() => this.setState({ error: null })} />
                <View style={{
                    flex: 1,
                    justifyContent: 'center', 
                    alignItems: 'center'
                }}>
                    <View width={this.props.device.getX(65)} style={{ alignItems: 'center' }}>
                        <Form
                            formSetting={this.formSetting()}
                            containerStyle={{ alignItems: 'center' }}
                            rowStyle={{ flexDirection: 'row', margin: 5 }}
                        />
                        {
                            this.state.confirmCode 
                            ? 
                                <Confirm
                                    ref={ref => this.confirmRef = ref}
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
                    </View>
                </View>
            </View>
        );
    }
};

export default compose(
    withFirebase,
    withDevice,
    withAPI,
)(PhoneNumber);