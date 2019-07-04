import React from 'react';

import withFirebase from '#extension/firebase';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import { compose } from '#utility';
import Stepper from '#components/Stepper';
import Form from '#components/Form';

import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';

export class UserDetail extends React.PureComponent {

    state = {
        name: 'NG SZE CHEN',
        age: '20',
        cons: 'Constellation',
        sex: 'Sex',
        avatar: null,
    }

    formSetting = () => [
        {
            type: 'image',
            row: 0,
            dcc: (avatar) => this.setState({ avatar }),
            setting: {
                value: this.state.avatar
            }
        },
        {
            type: 'input',
            row: 1,
            dcc: (name) => this.setState({ name }),
            style: {
                mode: 'outlined',
                width: this.props.device.getX(78),
            },
            setting: {
                key: 'Name',
                value: this.state.name
            }
        },
        {
            type: 'input',
            row: 2,
            dcc: (age) => this.setState({ age }),
            style: {
                mode: 'outlined',
                keyboardType: 'numeric',
                width: this.props.device.getX(30),
            },
            setting: {
                key: 'Age',
                value: this.state.age
            }
        },
        {
            type: 'picker',
            row: 2,
            dcc: (cons) => this.setState({ cons }),
            style: {
                width: this.props.device.getX(45),
                marginLeft: this.props.device.getX(3),
            },
            setting: {
                key: 'Constellation',
                value: this.state.cons,
                items: [ 'Cancer' ],
            }
        },
        {
            type: 'picker',
            row: 3,
            dcc: (sex) => this.setState({ sex }),
            style: {
                width: this.props.device.getX(30),
            },
            setting: {
                key: 'Sex',
                value: this.state.sex,
                items: ['Male', 'Female', 'Other'],
            }
        },
        {
            type: 'input',
            row: 3,
            dcc: (utag) => this.setState({ utag }),
            style: {
                width: this.props.device.getX(48),
            },
            setting: {
                key: 'Tag',
                value: this.state.utag,
                prefix: '@'
            }
        },
        {
            type: 'richtext',
            row: 4,
            dcc: (desc) => this.setState({ desc }),
            style: {
                mode: 'outlined',
                width: this.props.device.getX(80),
                height: this.props.device.getY(30),
            },
            setting: {
                key: 'Introduction yourself',
                value: this.state.desc
            }
        },
    ];

    updateProfile = () => {
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    padding: 10
                }}>
                    <TouchableOpacity onPress={this.updateProfile}>
                        <Text>Next Step</Text>
                    </TouchableOpacity>
                </View>
                <Form 
                    containerStyle={{ alignItems: 'center' }}
                    rowStyle={{ flexDirection: 'row', margin: 5 }}
                    formSetting={this.formSetting()} 
                />
                <Stepper
                    containerStyle={{
                        flex: 1,
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end', 
                        flexDirection: 'row'
                    }}
                    currentStep={2}
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
)(UserDetail);