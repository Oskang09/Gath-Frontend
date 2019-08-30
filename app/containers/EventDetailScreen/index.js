import React from 'react';
import { BackHandler } from 'react-native';

import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card, Paragraph, Avatar, Button, FAB } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import AsyncContainer from '#components/AsyncContainer';
import Form from '#components/Form';
import Icon from '#components/Icon';
import PureList from '#components/PureList';

import { compose } from '#utility';
import withDevice from '#extension/device';
import withError from '#extension/error';
import withAPI from '#extension/apisauce';

export class EventDetailScreen extends React.PureComponent {

    state = {
        loading: false,
        meta: this.props.api.request('GET', `/events/${this.props.navigation.state.params.id}/meta`),
        event: this.props.navigation.state.params,
        comment: ''
    }

    static iconMaps = [
        { package: 'materialicons', name: 'access-time' },
        { package: 'entypo', name: 'location' },
    ]

    createComment = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });
        try {
            await this.props.api.request(
                'POST', 
                `/events/${this.props.navigation.state.params.id}/comments`,
                { comment: this.state.comment }
            )
            this.setState({
                loading: false,
                event: async function() {
                    const response = await this.props.api.request('GET', `/events/${this.props.navigation.state.params.id}`);
                    return response.result;
                },
                comment: null,
            });
        } catch (error) {
            this.setState({ loading: false }, () => this.props.showError(error.message));
        }
    }

    formSetting = () => [
        {
            type: 'richtext',
            row: 0,
            dcc: (comment) => this.setState({ comment }),
            key: 'user-comment',
            props: {
                mode: 'outlined',
                width: this.props.device.getX(80),
                height: this.props.device.getY(25),
                placeholder: 'Write something ...',
            },
            setting: {
                value: this.state.comment
            }
        }
    ]

    componentWillMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    handleBack = () => this.props.navigation.navigate('event_list')

    handleEventAction = async (action) => {
        await this.props.api.request('PATCH', {
            event: this.props.navigation.state.params.id,
            action
        });
        this.setState({
            meta: this.props.api.request('GET', `/events/${this.props.navigation.state.params.id}/meta`),
        });
    }

    renderComments = ({ item, index }) => {
        const isEditable = index === 0;
        return (
            <Card style={{ ...this.props.device.marginXY(this.props.device.getX(5), this.props.device.getY(1.25)) }}>
                <Card.Title
                    title="Ng Sze Chen"
                    subtitle="Wed 02:59"
                    left={
                        (props) => <Avatar.Image size={50} source={{ uri: '' }} />
                    }
                />
                <Card.Content>
                    {
                        isEditable ? 
                            <Form containerStyle={{ alignItems: 'center' }} formSetting={this.formSetting()} /> :
                            <Paragraph>{item}</Paragraph>
                    }
                </Card.Content>
                <Card.Actions style={{ justifyContent: 'flex-end' }}>
                {
                    isEditable && (
                        <Button onPress={this.createComment} mode="contained" width={this.props.device.getX(20)}>
                            <Text style={{ color: 'white'}}>SEND</Text>
                        </Button>
                    )
                }
                </Card.Actions>
            </Card>
        );
    }

    renderBack = () => {
        return (
            <TouchableOpacity 
                style={{ position: 'absolute', margin: 16, top: 0, left: 0 }}
                onPress={this.handleBack}
            >
                <MaterialIcon name="arrow-back" color="black" size={19} />
            </TouchableOpacity>
        );
    }

    renderButton = (meta) => {
        const buttons = [];
        const styles = {
            style: {
                height: this.props.device.getY(7.5),
                justifyContent: 'center'
            },
            mode: 'contained',
            theme: {
                roundness: 0
            }
        };
        if (meta.isNormal) {
            buttons.push(
                <Button {...styles} onPress={() => this.handleEventAction('REQUEST')}>
                    <Text style={{ color: "#ffffff" }}>Join Event</Text>
                </Button>
            );
        }

        if (meta.isRequest) {
            buttons.push(
                <Button {...styles}>
                    <Text style={{ color: "#ffffff" }}>Requesting ...</Text>
                </Button>
            );
        }

        if (meta.isMember) {
            buttons.push(
                <Button {...styles} onPress={() => this.handleEventAction('QUIT')}>
                    <Text style={{ color: "#ffffff" }}>Quit Event</Text>
                </Button>
            );
        }

        if (meta.isOwner) {
            buttons.push(
                <Button {...styles} onPress={() => this.handleEventAction('START_EVENT')}>
                    <Text style={{ color: "#ffffff" }}>Start Event</Text>
                </Button>
            );
        }

        return (
            <View style={{ position: 'absolute', bottom: 0, width: this.props.device.getX(100) }}>
                { buttons }
            </View>
        )
    }

    render() {
        return (
            <AsyncContainer promise={Promise.all([ this.state.event, this.state.meta ])}>
                {( [ result, meta ] ) => (
                    <View>
                        <PureList
                            type="vertical"
                            numColumns={1}
                            containerStyle={{ marginBottom: this.props.device.getY(7.5) }}
                            header={
                                <View style={{ flex: 1 }}>
                                    <Image
                                        style={{ height: this.props.device.getY(25) }}
                                        source={{ uri: this.props.api.cdn(`event-${result.id}`) }}
                                    />
                                    <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 19, fontWeight: 'bold' }}>{result.name}</Text>
                                    <PureList
                                        type="horizontal"
                                        containerStyle={{ marginLeft: this.props.device.getX(3) }}
                                        data={[
                                            moment(result.start_time).format('DD/MM/YYYY, HH:mm'),
                                            result.location,
                                        ]}
                                        render={
                                            ({ item, index }) => {
                                                const iconSetting = EventDetailScreen.iconMaps[index];
                                                return (
                                                    <Card
                                                        style={{
                                                            margin: this.props.device.getX(2),
                                                            width: this.props.device.getX(35)
                                                        }}
                                                    >
                                                        <Card.Content style={{ alignItems: 'center' }}>
                                                            <Icon size={33} {...iconSetting} />
                                                            <Paragraph style={{ fontSize: 10 }}>{item}</Paragraph>
                                                        </Card.Content>
                                                    </Card>
                                                );
                                            }
                                        }
                                    />
                                    <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 19, fontWeight: 'bold' }}>Comments</Text>
                                    { this.renderBack() }
                                </View>

                            }
                            data={[
                                null,
                                ...this.state.event.comments,
                            ]}
                            render={this.renderComments}
                        />
                        { this.renderButton(meta) }
                    </View>
                )}
            </AsyncContainer>
        );
    }
};

export default compose(
    withDevice,
    withAPI,
    withError,
)(EventDetailScreen);