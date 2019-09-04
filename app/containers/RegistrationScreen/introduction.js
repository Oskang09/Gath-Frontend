import React, { createRef } from 'react';
import { View, Text } from 'react-native';
import { Button, Card } from 'react-native-paper';
import Appbar from '#components/Appbar';

import withFirebase from '#extension/firebase';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import withDialog from '#extension/dialog';
import { compose } from '#utility';
import Form from '#components/Form';

export class Introduction extends React.PureComponent {
    state = {
        desc: null,
        loading: false,
    }
    confirmRef = createRef()

    formSetting = () => [
        {
            type: 'richtext',
            row: 0,
            dcc: (desc) => this.setState({ desc }),
            key: 'user-desc',
            props: {
                mode: 'outlined',
                width: this.props.device.getX(80),
                height: this.props.device.getY(35),
            },
            setting: {
                value: this.state.desc
            }
        },
    ];

    updateDescription = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });
        try {
            const { api, navigation } = this.props;
            await api.request(
                'POST', 
                `/users/profile`,
                { desc: this.state.desc, status: 'REGISTERED' }
            );
            navigation.navigate('home');
        } catch (error) {
            this.setState({ loading: false }, () => this.props.showDialog(error.message));
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar /> 
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} behavior="position">
                    <Card width={this.props.device.getX(90)}>
                        <Card.Title title="Describe yourself ..." />
                        <Card.Content>
                            <Form
                                containerStyle={{ alignItems: 'center' }}
                                rowStyle={{ flexDirection: 'row', margin: 5 }}
                                formSetting={this.formSetting()} 
                            />
                        </Card.Content>
                        <Card.Actions style={{ justifyContent: 'center' }}>
                            <Button mode="contained" width={this.props.device.getX(25)} onPress={this.updateDescription}>
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
    withFirebase,
    withDevice,
    withAPI,
    withDialog
)(Introduction);