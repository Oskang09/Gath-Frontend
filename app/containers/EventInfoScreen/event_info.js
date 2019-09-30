import React from 'react';
import { View, Text } from 'react-native';
import { Card, Button } from 'react-native-paper';

import StyledButton from '#components/Button';
import Form from '#components/Form';
import Appbar from '#components/Appbar';

import { filterObject } from '#utility';

export class EventInfoScreen extends React.Component {
    state = {
        name: this.props.getState('name'),
        start: this.props.getState('start') || Date.now(),
        type: this.props.getState('type') || "DINING",
        banner: null,
    }

    imageSetting = () => [
        {
            type: 'image',
            row: 0,
            dcc: (banner) => this.setState({ banner }),
            key: 'event-image',
            setting: {
                value: this.state.banner || this.props.api.cdn(this.props.getState('image')),
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
            dcc: (start) => this.setState({ start }),
            key: 'start',
            props: {
                width: this.props.device.getX(45),
            },
            setting: {
                label: 'Event Start',
                value: this.state.start,
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
                items: this.props.api.getConfig().eventType
            }
        },
    ];

    componentWillMount() {
        this.props.backHandler(
            () => {
                this.props.showAlert({
                    title: `Cancel ${this.props.navigation.state.params ? 'update' : 'create'} event`,
                    content: 'Did you want to discard all changes?',
                    customSubmit: (submit, isLoading) => (
                        <StyledButton
                            roundness={5}
                            onPress={submit}
                            loading={isLoading}
                            text="Yes"
                        />
                    ),
                    submit: () => this.props.navigator.back(),
                });
                return true;
            }
        );
    }

    nextStep = () => {
        if (!this.state.name || this.state.name === "") {
            return this.props.showDialog(`Event name can't be empty.`);
        }
        if (this.state.start < Date.now()) {
            return this.props.showDialog('Event start time must be future.');
        }
        return this.props.nextStep(
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
            </View>
        );
    }
};

export default EventInfoScreen;