import React from 'react';

import { View, Text } from 'react-native';
import { Card, Paragraph, Avatar, Button } from 'react-native-paper';
import moment from 'moment';

import Appbar from '#components/Appbar';
import Image from '#components/Image';
import AsyncContainer from '#components/AsyncContainer';
import Form from '#components/Form';
import Icon from '#components/Icon';
import PureList from '#components/PureList';

import { compose } from '#utility';
import withDevice from '#extension/device';
import withDialog from '#extension/dialog';
import withAPI from '#extension/apisauce';
import withBack from '#extension/backhandler';

export class EventDetailScreen extends React.PureComponent {

    state = {
        loading: false,
        event: this.props.navigation.state.params,
        comment: ''
    }

    static iconMaps = [
        { package: 'materialicons', name: 'access-time' },
        { package: 'entypo', name: 'location' },
        { package: 'fontawesome5', name: 'store' },
        { package: 'materialicons', name: 'people' }
    ]

    createComment = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });
        try {
            await this.props.api.request(
                'POST', 
                `/events/${this.state.event.id}/comments`,
                { comment: this.state.comment }
            );
            this.setState({
                loading: false,
                comment: null,
            }, () => this.dataController.reload('event'));
        } catch (error) {
            this.setState({ loading: false }, () => this.props.showDialog(error.message));
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

    handleEventAction = async (action) => {
        await this.props.api.request('POST', `/events/${this.state.event.id}`, { action });
        if (action === 'START_EVENT' || action === 'END_EVENT') {
            await this.dataController.reload('event');
        }
    }

    renderUserComments = () => {
        return (
            <Card style={{ ...this.props.device.marginXY(this.props.device.getX(5), this.props.device.getY(1.25)) }}>
                <Card.Title
                    title="NG SZE CHEN"
                    left={ (props) => <Avatar.Image size={50} source={{ uri: this.props.api.cdn(`user-1`) }} /> }
                />
                <Card.Content>
                    <Form containerStyle={{ alignItems: 'center' }} formSetting={this.formSetting()} />
                </Card.Content>
                <Card.Actions style={{ justifyContent: 'flex-end' }}>
                    <Button onPress={this.createComment} mode="contained" width={this.props.device.getX(20)}>
                        <Text style={{ color: 'white'}}>SEND</Text>
                    </Button>
                </Card.Actions>
            </Card>
        );
    }

    renderComments = ({ item }) => {
        return (
            <Card style={{ ...this.props.device.marginXY(this.props.device.getX(5), this.props.device.getY(1.25)) }}>
                <Card.Title
                    title={item.name}
                    subtitle={moment(item.when).format('ddd, HH:mm')}
                    left={
                        (props) => <Avatar.Image size={50} source={{ uri: this.props.api.cdn(`user-${item.by}`) }} />
                    }
                />
                <Card.Content>
                    <Paragraph>{item.comment}</Paragraph>
                </Card.Content>
            </Card>
        );
    }

    renderButton = (event, meta) => {
        const buttons = [];
        const props = (color = this.props.device.primaryColor) => ({
            style: {
                height: this.props.device.getY(7.5),
                justifyContent: 'center',
            },
            compact: true,
            mode: 'contained',
            theme: {
                colors: {
                    primary: color  
                },
                roundness: 0
            }
        });

        if (event.status === 'PENDING') {
            if (meta.isNormal) {
                buttons.push(
                    <Button key="normal-btn" {...props()} onPress={() => this.handleEventAction('REQUEST')}>
                        <Text style={{ color: "#ffffff" }}>Join Event</Text>
                    </Button>
                );
            }
    
            if (meta.isRequest) {
                buttons.push(
                    <Button key="request-btn" {...props()}>
                        <Text style={{ color: "#ffffff" }}>Requesting ...</Text>
                    </Button>
                );
            }
    
            if (meta.isMember) {
                buttons.push(
                    <Button key="member-btn" {...props()} onPress={() => this.handleEventAction('QUIT')}>
                        <Text style={{ color: "#ffffff" }}>Quit Event</Text>
                    </Button>
                );
            }
        }
        
        if (event.status === 'PENDING') {
            if (meta.isOwner) {
                buttons.push(
                    <Button key="owner-btn" {...props()} onPress={() => this.handleEventAction('START_EVENT')}>
                        <Text style={{ color: "#ffffff" }}>Start Event</Text>
                    </Button>
                );
            }
        }

        if (event.status === 'START') {
            if (meta.isOwner) {
                buttons.push(
                    <Button key="owner-btn" {...props('#ff0000')} onPress={() => this.handleEventAction('END_EVENT')}>
                        <Text style={{ color: "#ffffff" }}>End Event</Text>
                    </Button>
                );
            }
        }

        return (
            <View style={{ position: 'absolute', bottom: 0, width: this.props.device.getX(100) }}>
                { buttons }
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar home={true} />
                <AsyncContainer
                    controller={(ctl) => this.dataController = ctl}
                    promise={{
                        event: this.props.api.build('GET', `/events/${this.state.event.id}`),
                        meta: this.props.api.build('GET', `/events/${this.state.event.id}/meta`),
                        shop: this.props.api.build('GET', `/shops/${this.state.event.shopId}`)
                    }}
                >
                    {
                        ({ event, meta, shop }) => (
                            <View style={{ flex: 1 }}>
                                <PureList
                                    type="vertical"
                                    numColumns={1}
                                    containerStyle={{ marginBottom: this.props.device.getY(7.5) }}
                                    header={
                                        <View style={{ flex: 1 }}>
                                            <Image
                                                style={{ height: this.props.device.getY(25) }}
                                                source={this.props.api.cdn(`event-${event.id}`)}
                                            />
                                            <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 19, fontWeight: 'bold' }}>{event.name}</Text>
                                            <PureList
                                                type="horizontal"
                                                containerStyle={{ marginLeft: this.props.device.getX(3) }}
                                                data={[
                                                    moment(event.start_time).format('DD/MM/YYYY, HH:mm'),
                                                    event.location,
                                                    shop.name,
                                                    `${meta.numberOfUser} Peoples`
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
                                            { this.renderUserComments() }
                                        </View>
                
                                    }
                                    data={event.comments}
                                    render={this.renderComments}
                                />
                                { this.renderButton(event, meta) }
                            </View>
                        )
                    }
                </AsyncContainer>
            </View>
        );
    }
};

export default compose(
    withDevice,
    withAPI,
    withDialog,
    withBack('event_list'),
)(EventDetailScreen);