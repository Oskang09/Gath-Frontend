import React from 'react';

import { View, Text } from 'react-native';
import { Card, Paragraph, Avatar } from 'react-native-paper';
import moment from 'moment';

import Button from '#components/Button';
import Appbar from '#components/Appbar';
import Image from '#components/Image';
import AsyncContainer from '#components/AsyncContainer';
import Form from '#components/Form';
import Icon from '#components/Icon';
import PureList from '#components/PureList';

import { compose } from '#utility';
import withAlert from '#extension/alert';
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
        { package: 'materialicons', name: 'people' },
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
            }, () => this.dataController.reload('comment'));
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
        if (action === 'REQUEST' || action === 'QUIT' || action === 'CHECK_IN') {
            await this.dataController.reload('meta');
        }
        if (action === 'START_EVENT' || action === 'END_EVENT') {
            await this.dataController.reload('event');
        }
    }

    renderComments = ({ item }) => {
        return (
            <Card style={{ ...this.props.device.marginXY(this.props.device.getX(5), this.props.device.getY(1.25)) }}>
                <Card.Title
                    title={item.user.name}
                    subtitle={moment(item.createdAt).format('ddd, HH:mm')}
                    left={
                        (props) => <Avatar.Image size={50} source={{ uri: this.props.api.cdn(`user-${item.userId}`) }} />
                    }
                />
                <Card.Content>
                    <Paragraph>{item.comment}</Paragraph>
                </Card.Content>
            </Card>
        );
    }

    renderAction = (event, meta, shop) => {
        const buttons = [];
        if (meta.isOwner) {
            if (event.status === 'PENDING') {
                buttons.push(
                    <View key="edit-event" style={{ margin: 10 }}>
                        <Button
                            onPress={() => this.props.navigation.navigate({
                                routeName: 'event_info',
                                params: Object.assign({}, event, { shop })
                            })}
                            roundness={5}
                            width={this.props.device.getX(75)}
                            textStyle={{ color: 'white' }}
                            text="Edit Event"
                        />
                    </View>
                );
                buttons.push(
                    <View key="del-event" style={{ margin: 10 }}>
                        <Button
                            onPress={
                                () => this.props.showAlert({
                                    title: 'Delete event',
                                    content: 'Deleting the event task cannot be undone, and all data within the event will lost.',
                                    submit: async () => {
                                        await this.props.api.request('DELETE', `/events/${event.id}`);
                                        return this.props.navigation.navigate('event_list');
                                    }
                                })
                            }
                            roundness={5}
                            color="#ff0000"
                            width={this.props.device.getX(75)}
                            textStyle={{ color: 'white' }}
                            text="Delete Event"
                        />
                    </View>
                );
            }
        }

        buttons.push(
            <View key="view-comments" style={{ margin: 10 }}>
                <Button
                    width={this.props.device.getX(75)}
                    roundness={5}
                    text="View Comments"
                    onPress={() => this.props.navigation.navigate({ routeName: 'event_comment', params: { event, meta } })}
                />
            </View>
        );

        buttons.push(
            <View key="view-people" style={{ margin: 10 }}>
                <Button
                    width={this.props.device.getX(75)}
                    roundness={5}
                    text="View Peoples"
                    onPress={() => this.props.navigation.navigate({ routeName: 'event_user', params: { event, meta } })}
                />
            </View>
        );

        return (
            <View style={{ alignItems: 'center', margin: 10 }}>
                {buttons}
            </View>
        );
    }

    renderButton = (event, meta) => {
        const buttons = [];
        if (event.status === 'PENDING') {
            if (meta.isNormal) {
                buttons.push(
                    <Button
                        key="normal-btn"
                        width={this.props.device.getX(100)}
                        onPress={() => this.handleEventAction('REQUEST')}
                        text="Join Event"
                    />
                );
            }

            if (meta.isRequest) {
                buttons.push(
                    <Button
                        key="request-btn"
                        width={this.props.device.getX(100)}
                        text="Requesting ..."
                    />
                );
            }

            if (meta.isMember) {
                buttons.push(
                    <Button
                        key="member-btn"
                        width={this.props.device.getX(100)}
                        onPress={() => this.handleEventAction('QUIT')}
                        color="#ff0000"
                        text="Quit Event"
                    />
                );
            }
        }

        if (event.status === 'PENDING') {
            if (meta.isOwner) {
                buttons.push(
                    <Button
                        key="owner-btn"
                        width={this.props.device.getX(100)}
                        onPress={() => this.handleEventAction('START_EVENT')}
                        text="Start Event"
                    />
                );
            }
        }

        if (event.status === 'START') {
            if (meta.isMember) {
                buttons.push(
                    <Button
                        key="checkin-btn"
                        width={this.props.device.getX(100)}
                        onPress={() => this.handleEventAction('CHECK_IN')}
                        text="Check In"
                    />
                );
            }
            if (meta.isOwner) {
                buttons.push(
                    <Button
                        key="end-btn"
                        width={this.props.device.getX(100)}
                        color="#ff0000"
                        onPress={() => this.handleEventAction('END_EVENT')}
                        text="End Event"
                    />
                );
            }
        }

        if (buttons.length > 0) {
            return (
                <View style={{ position: 'absolute', bottom: 0, width: this.props.device.getX(100) }}>
                    {buttons}
                </View>
            );
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar home={true} />
                <AsyncContainer
                    controller={(ctl) => this.dataController = ctl}
                    promise={{
                        event: this.props.api.build('GET', `/events/${this.state.event.id}`),
                        comment: this.props.api.build('GET', `/events/${this.state.event.id}/comments?limit=5`),
                        meta: this.props.api.build('GET', `/events/${this.state.event.id}/meta`),
                        shop: this.props.api.build('GET', `/shops/${this.state.event.shopId}`),
                        profile: this.props.api.build('GET', '/users/profile'),
                    }}
                >
                    {
                        ({ event, meta, shop, profile, comment }) => {
                            const absoluteButton = this.renderButton(event, meta);
                            return (
                                <View style={{ flex: 1 }}>
                                    <PureList
                                        type="vertical"
                                        numColumns={1}
                                        containerStyle={{ marginBottom: absoluteButton && this.props.device.getY(7.5) }}
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
                                                        `${meta.numberOfUser} Peoples`,
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
                                                <Card style={{ ...this.props.device.marginXY(this.props.device.getX(5), this.props.device.getY(1.25)) }}>
                                                    <Card.Title
                                                        title={profile.name}
                                                        left={(props) => <Avatar.Image size={50} source={{ uri: this.props.api.cdn(`user-${profile.id}`) }} />}
                                                    />
                                                    <Card.Content>
                                                        <Form containerStyle={{ alignItems: 'center' }} formSetting={this.formSetting()} />
                                                    </Card.Content>
                                                    <Card.Actions style={{ justifyContent: 'flex-end' }}>
                                                        <Button
                                                            onPress={this.createComment}
                                                            roundness={5}
                                                            textStyle={{ color: 'white' }}
                                                            text="SEND"
                                                        />
                                                    </Card.Actions>
                                                </Card>
                                            </View>
                                        }
                                        footer={this.renderAction(event, meta, shop)}
                                        data={comment.result}
                                        render={this.renderComments}
                                    />
                                    {absoluteButton}
                                </View>
                            );
                        }
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
    withAlert,
    withBack('event_list'),
)(EventDetailScreen);