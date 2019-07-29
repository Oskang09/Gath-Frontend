import React, { createRef } from 'react';
import { View, Text } from 'react-native';
import { Button, Appbar, Card } from 'react-native-paper';

import withFirebase from '#extension/firebase';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import { compose } from '#utility';
import Form from '#components/Form';

export class Introduction extends React.PureComponent {
    state = {
        desc: null,
        error: null,
        loading: false,
    }
    confirmRef = createRef()

    formSetting = () => [
        {
            type: 'richtext',
            row: 0,
            dcc: (desc) => this.setState({ desc }),
            props: {
                mode: 'outlined',
                width: this.props.device.getX(80),
                height: this.props.device.getY(35),
            },
            setting: {
                key: 'user-desc',
                value: this.state.desc
            }
        },
    ];

    updateDescription = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true, error: null });
        try {
            const { api, navigation } = this.props;
            const response = await api.request(
                'POST', 
                `/users/profile`,
                { desc: this.state.desc }
            );
            if (response.ok) {
                navigation.navigate('badge');
            } else {
                this.setState({ loading: false, error: response.message });
            }
        } catch (error) {
            this.setState({ loading: false, error });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar>
                    <Appbar.Content title="Gath" />
                </Appbar>
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
)(Introduction);