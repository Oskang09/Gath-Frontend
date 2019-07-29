import React from 'react';

import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import { compose, filterObject } from '#utility';
import Form from '#components/Form';

import { View } from 'react-native';
import { Text, Card, Button, Appbar } from 'react-native-paper';

export class UserDetail extends React.PureComponent {

    state = {
        name: 'NG SZE CHEN',
        age: '20',
        constellation: 'Aries',
        gender: 'Male',
        avatar: null,
        utag: '',

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
            props: {
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
            props: {
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
            props: {
                style: {
                    width: this.props.device.getX(45),
                    marginLeft: this.props.device.getX(3),
                }
            },
            setting: {
                label: 'Constellation',
                key: 'user-cons',
                value: this.state.constellation,
                items: this.props.api.getConfig().constellation,
            }
        },
        {
            type: 'picker',
            row: 3,
            dcc: (gender) => this.setState({ gender }),
            props: {
                style: {
                    width: this.props.device.getX(30),
                    marginRight: this.props.device.getX(3),
                }
            },
            setting: {
                label: 'Gender',
                key: 'user-gender',
                value: this.state.gender,
                items: ['Male', 'Female', 'Other'],
            }
        },
        {
            type: 'input',
            row: 3,
            dcc: (utag) => this.setState({ utag }),
            props: {
                mode: 'outlined',
                width: this.props.device.getX(45),
            },
            setting: {
                label: 'Alias',
                key: 'user-tag',
                value: this.state.utag,
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
                filterObject(this.state, 'name', 'age', 'constellation', 'gender', 'avatar', 'utag')
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
            <View style={{ flex: 1 }}>
                <Appbar>
                    <Appbar.Content title="Gath" />
                </Appbar>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} behavior="position">
                    <Card width={this.props.device.getX(90)}>
                        <Card.Content>
                            <Form
                                containerStyle={{ alignItems: 'center' }}
                                rowStyle={{ flexDirection: 'row', margin: 5 }}
                                formSetting={this.formSetting()} 
                            />
                        </Card.Content>
                        <Card.Actions style={{ justifyContent: 'center' }}>
                            <Button mode="contained" width={this.props.device.getX(25)} onPress={this.updateProfile}>
                                <Text style={{ color: 'white' }}>NEXT</Text>
                            </Button>
                        </Card.Actions>
                    </Card>
                </View>
            </View>
        );
    }
};

export default compose(
    withDevice,
    withAPI,
)(UserDetail);