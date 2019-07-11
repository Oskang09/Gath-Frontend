import React from 'react';

import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import { compose, filterObject } from '#utility';
import Form from '#components/Form';

import { View, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Text } from 'react-native-paper';

export class UserDetail extends React.PureComponent {

    state = {
        name: 'NG SZE CHEN',
        age: '20',
        constellation: 'Constellation',
        gender: 'Sex',
        avatar: null,
        utag: '',
        desc: null,
        loading: false,
        error: null,
    }

    formSetting = () => [
        {
            type: 'image',
            row: 0,
            dcc: (avatar) => this.setState({ avatar }),
            setting: {
                key: 'user-avatar',
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
                label: 'Name',
                key: 'user-name',
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
                label: 'Age',
                key: 'user-age',
                value: this.state.age
            }
        },
        {
            type: 'picker',
            row: 2,
            dcc: (constellation) => this.setState({ constellation }),
            style: {
                width: this.props.device.getX(45),
                marginLeft: this.props.device.getX(3),
            },
            setting: {
                key: 'user-cons',
                value: this.state.constellation,
                items: [ 'Cancer' ],
            }
        },
        {
            type: 'picker',
            row: 3,
            dcc: (gender) => this.setState({ gender }),
            style: {
                width: this.props.device.getX(30),
                marginRight: this.props.device.getX(3),
            },
            setting: {
                key: 'user-gender',
                value: this.state.gender,
                items: ['Male', 'Female', 'Other'],
            }
        },
        {
            type: 'input',
            row: 3,
            dcc: (utag) => this.setState({ utag }),
            style: {
                mode: 'outlined',
                width: this.props.device.getX(45),
            },
            setting: {
                label: 'Tag',
                key: 'user-tag',
                value: this.state.utag,
            }
        },
        {
            type: 'richtext',
            row: 4,
            dcc: (desc) => this.setState({ desc }),
            style: {
                mode: 'outlined',
                width: this.props.device.getX(80),
                height: this.props.device.getY(20),
            },
            setting: {
                label: 'Introduction about yourself ...',
                key: 'user-desc',
                value: this.state.desc
            }
        },
    ];

    updateProfile = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true, error: null });
        try {
            const { api, navigation } = this.props;
            const response = await api.request(
                'POST', 
                `/users/profile`, 
                filterObject(this.state, 'name', 'age', 'constellation', 'gender', 'avatar', 'utag', 'desc')
            );
            if (response.ok) {
                navigation.navigate('personality');
            } else {
                this.setState({ loading: false, error: response.message });
            }
        } catch (error) {
            this.setState({ loading: false, error });
        }
    };

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="position">
                <TouchableOpacity onPress={this.updateProfile}>
                    <View style={{
                        alignItems: 'flex-end',
                        padding: 10
                    }}>
                        <Text>Next Step</Text>
                    </View>
                </TouchableOpacity>
                <Form
                    containerStyle={{ alignItems: 'center' }}
                    rowStyle={{ flexDirection: 'row', margin: 5 }}
                    formSetting={this.formSetting()} 
                />
            </KeyboardAvoidingView>
        );
    }
};

export default compose(
    withDevice,
    withAPI,
)(UserDetail);