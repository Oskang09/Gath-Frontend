import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';

import Form from '#components/Form';
import Appbar from '#components/Appbar';

import withError from '#extension/error';
import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';

import { compose, filterObject } from '#utility';

export class CreateEventScreen extends React.Component {
    state = {
        name: this.props.getState().name,
        start: this.props.getState().start || Date.now(),
        type: this.props.getState().type,
        tags: this.props.getState().tags,
        banner: this.props.getState().banner,
    }

    imageSetting = () => [
        {
            type: 'image',
            row: 0,
            dcc: (banner) => this.setState({ banner }),
            key: 'event-image',
            setting: {
                value: this.state.banner,
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
                items: [ 'type1', 'type2' ]
            }
        },
        {
            type: 'input',
            row: 2,
            dcc: (tags) => this.setState({ tags }),
            key: 'tags',
            props: {
                mode: 'outlined',
                width: this.props.device.getX(85),
            },
            setting: {
                label: 'Event Tag',
                value: this.state.tags,
            }
        },
    ];

    componentWillMount() {
        this.props.backHandler(
            () => {
                // TODO: dialog ask for quit and navigate to event_listing
                return true;
            }
        );
    }

    nextStep = () => {
        this.props.nextStep(
            filterObject(this.state, 'name', 'start', 'type', 'tags', 'banner')
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

export default compose(
    withAPI,
    withDevice,
    withError
)(CreateEventScreen);