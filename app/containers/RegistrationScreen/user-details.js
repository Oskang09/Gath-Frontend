import React from 'react';

import { View } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import Appbar from '#components/Appbar';
import Form from '#components/Form';

import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import withDialog from '#extension/dialog';
import { compose, filterObject } from '#utility';

export class UserDetail extends React.PureComponent {

    state = {
        name: '',
        age: '',
        constellation: 'Aries',
        gender: 'Male',
        avatar: null,
        utag: '',

        loading: false,
    }

    formSetting = () => [
        {
            type: 'image',
            row: 0,
            dcc: (avatar) => this.setState({ avatar }),
            key: 'user-avatar',
            setting: {
                value: this.state.avatar
            }
        },
        {
            type: 'input',
            row: 1,
            dcc: (name) => this.setState({ name }),
            key: 'user-name',
            props: {
                mode: 'outlined',
                width: this.props.device.getX(78),
            },
            setting: {
                label: 'Name',
                value: this.state.name
            }
        },
        {
            type: 'input',
            row: 2,
            dcc: (age) => this.setState({ age }),
            key: 'user-age',
            props: {
                mode: 'outlined',
                keyboardType: 'numeric',
                width: this.props.device.getX(30),
            },
            setting: {
                label: 'Age',
                value: this.state.age
            }
        },
        {
            type: 'picker',
            row: 2,
            dcc: (constellation) => this.setState({ constellation }),
            key: 'user-cons',
            props: {
                style: {
                    width: this.props.device.getX(45),
                    marginLeft: this.props.device.getX(3),
                }
            },
            setting: {
                label: 'Constellation',
                value: this.state.constellation,
                items: this.props.api.getConfig().constellation,
            }
        },
        {
            type: 'picker',
            row: 3,
            dcc: (gender) => this.setState({ gender }),
            key: 'user-gender',
            props: {
                style: {
                    width: this.props.device.getX(30),
                    marginRight: this.props.device.getX(3),
                }
            },
            setting: {
                label: 'Gender',
                value: this.state.gender,
                items: ['Male', 'Female', 'Other'],
            }
        },
        {
            type: 'input',
            row: 3,
            dcc: (utag) => this.setState({ utag }),
            key: 'user-tag',
            props: {
                mode: 'outlined',
                width: this.props.device.getX(45),
            },
            setting: {
                label: 'Alias',
                value: this.state.utag,
            }
        },
    ];

    updateProfile = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });
        try {
            if (!this.state.name || this.state.name === "") {
                throw Error("User name can't be empty.");
            }

            if (!this.state.age || this.state.age === "" || isNaN(parseInt(this.state.age))) {
                throw Error("User age mus't be number.");
            }

            if (!this.state.utag || this.state.utag === "") {
                throw Error("User alias can't be empty.");
            }


            const { api, navigation } = this.props;
            await api.request(
                'POST',
                `/users/profile`,
                filterObject(this.state, 'name', 'age', 'constellation', 'gender', 'avatar', 'utag')
            );
            navigation.navigate('personality');
        } catch (error) {
            this.setState({ loading: false }, () => this.props.showDialog(error.message));
        }
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar eventTrack={false} /> 
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
                            <Button mode="contained" loading={this.state.loading} width={this.props.device.getX(25)} onPress={this.updateProfile}>
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
    withDialog
)(UserDetail);