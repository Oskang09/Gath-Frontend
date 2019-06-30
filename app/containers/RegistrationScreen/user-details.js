import React from 'react';

import withFirebase from '#extension/firebase';
import withPixel from '#extension/device';
import withAPI from '#extension/apisauce';
import { compose } from '#utility';
import Stepper from '#components/Stepper';
import UserInput from '#components/UserInput';

import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';

export class UserDetail extends React.PureComponent {

    state = {
        name: 'NG SZE CHEN',
        age: '20',
        cons: 'cancer',
        sex: 'male'
    }

    formSetting = () => [
        {
            type: 'input',
            dcc: (value) => this.setState({
                name: value
            }),
            setting: {
                key: 'Name',
                value: this.state.name
            }
        },
        {
            type: 'input',
            dcc: (value) => this.setState({
                age: value
            }),
            setting: {
                key: 'Age',
                value: this.state.age
            }
        },
        {
            type: 'picker',
            dcc: (value) => this.setState({
                cons: value
            }),
            setting: {
                key: 'Constellation',
                value: this.state.cons,
                selectable: [
                    {
                        label: 'Cancer',
                        value: 'cancer'
                    }
                ], 
            }
        },
        {
            type: 'picker',
            dcc: (value) => this.setState({
                sex: value
            }),
            setting: {
                key: 'Sex',
                value: this.state.sex,
                selectable: [{
                    label: 'Male',
                    value: 'male'
                },{
                    label: 'Female',
                    value: 'female'
                },{
                    label: 'Other',
                    value: 'other'
                }],
            }
        }
    ];

    render() {
        return (
            <View style={{
                flex: 1,
            }}>
                <View style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    padding: 10
                }}>
                    <TouchableOpacity onPress={() => {
                        alert(this.state.nameController.getData())
                    }}>
                        <Text>Next Step</Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    alignItems: 'center',
                }}>
                    {
                        this.formSetting().map(
                            (props) => <UserInput {...props} />
                        )
                    }
                </View>
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
    withPixel,
    withAPI,
)(UserDetail);