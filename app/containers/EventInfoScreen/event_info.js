import React from 'react';
import { View, Text } from 'react-native';
import { Card, Button, Portal, Dialog, Paragraph } from 'react-native-paper';

import Form from '#components/Form';
import Appbar from '#components/Appbar';

import { filterObject } from '#utility';

export class EventInfoScreen extends React.Component {
    state = {
        name: this.props.getState().name,
        start: this.props.getState().start || Date.now(),
        type: this.props.getState().type,
        banner: this.props.getState().banner,
        quit: false,
    }

    imageSetting = () => [
        {
            type: 'image',
            row: 0,
            dcc: (banner) => this.setState({ banner }),
            key: 'event-image',
            setting: {
                value: this.state.banner || this.props.api.cdn(`event-${this.props.getState().id}`),
                displayComponent: (value) => <Card.Cover source={value} />
            }
        },
    ]

    formSetting = () => [
        {
            type: 'input',
            row: 0,
            dcc: (name) => this.setState({ name }),
            key: 'event-name',
            props: {
                mode: 'outlined',
                width: this.props.device.getX(85),
            },
            setting: {
                label: 'Event Name',
                value: this.state.name,
            }
        },
        {
            type: 'datetime',
            row: 1,
            dcc: (start_time) => this.setState({ start_time }),
            key: 'start',
            props: {
                width: this.props.device.getX(45),
            },
            setting: {
                label: 'Event Start',
                value: this.state.start_time,
            }
        },
        {
            type: 'picker',
            row: 1,
            dcc: (type) => this.setState({ type }),
            key: 'type',
            props: {
                style: {
                    marginLeft: this.props.device.getX(2),
                    width: this.props.device.getX(38),
                }
            },
            setting: {
                label: 'Event Type',
                value: this.state.type,
                items: ['type1', 'type2']
            }
        },
    ];

    componentWillMount() {
        this.props.backHandler(
            () => {
                this.setState({ quit: true });
                return true;
            }
        );
    }

    handleQuit = () => {
        if (this.props.defaultState.length === 0) {
            this.props.navigation.navigate('event_list');
        } else {
            this.props.navigation.navigate({ routeName: 'event_detail', params: this.props.navigation.state.params });
        }
    }

    nextStep = () => {
        this.props.nextStep(
            filterObject(this.state, 'name', 'start', 'type', 'banner')
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} behavior="position">
                    <Card width={this.props.device.getX(90)}>
                        <Form formSetting={this.imageSetting()} />
                        <Card.Content>
                            <Form
                                containerStyle={{ alignItems: 'center' }}
                                rowStyle={{ flexDirection: 'row', margin: 5 }}
                                formSetting={this.formSetting()}
                            />
                        </Card.Content>
                        <Card.Actions style={{ justifyContent: 'center' }}>
                            <Button mode="contained" width={this.props.device.getX(25)} onPress={this.nextStep}>
                                <Text style={{ color: 'white' }}>NEXT</Text>
                            </Button>
                        </Card.Actions>
                    </Card>
                </View>
                <Portal>
                    <Dialog visible={this.state.quit} dismissable={false}>
                        <Dialog.Content>
                            <Paragraph>
                                Did you want to discard all changes?
                            </Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.handleQuit}>YES</Button>
                            <Button onPress={() => this.setState({ quit: false })}>NO</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        );
    }
};

export default EventInfoScreen