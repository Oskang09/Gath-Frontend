import React from 'react';

import { View, Text, BackHandler, RefreshControl } from 'react-native';
import { Card, Paragraph, Avatar, ActivityIndicator } from 'react-native-paper';
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
import withNavigator from '#extension/navigator';
import withAPI from '#extension/apisauce';

export class EventDetailScreen extends React.PureComponent {

    state = {
        loading: false,
        refresh: false,
        event: this.props.navigation.state.params,
        comment: ''
    }

    static iconMaps = [
        { package: 'materialicons', name: 'access-time' },
        { package: 'entypo', name: 'location' },
        { package: 'fontawesome5', name: 'store' },
        { package: 'materialicons', name: 'people' },
    ]

    componentWillMount() {
        this._backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                this.props.navigator.back();
                return true;
            }
        );
    }

    componentWillUnmount() {
        this._backHandler.remove();
    }

    createComment = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });
        try {
            if (this.state.comment === '') {
                return this.setState({ loading: false }, () => this.props.showDialog(`Comment can't be empty`));
            }

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
                        (props) => <Avatar.Image size={50} source={{ uri: this.props.api.cdn(item.user.avatar) }} />
                    }
                />
                <Card.Content>
                    <Paragraph>{item.comment}</Paragraph>
                </Card.Content>
            </Card>
        );
    }

    renderAction = (event, meta) => {
        const buttons = [];

        if (meta.isNormal || meta.isRequest) {
            return null;
        }

        buttons.push(
            <View key="view-comments" style={{ margin: 10 }}>
                <Button
                    width={this.props.device.getX(40)}
                    roundness={5}
                    text="View Comments"
                    onPress={() => this.props.navigator.push({ routeName: 'event_comment', params: { event, meta } })}
                />
            </View>
        );

        buttons.push(
            <View key="view-people" style={{ margin: 10 }}>
                <Button
                    width={this.props.device.getX(40)}
                    roundness={5}
                    text="View Peoples"
                    onPress={() => this.props.navigator.push({ routeName: 'event_user', params: { event, meta } })}
                />
            </View>
        );

        if (event.status === 'END') {
            buttons.push(
                <View key="review-people" style={{ margin: 10 }}>
                    <Button
                        width={this.props.device.getX(40)}
                        roundness={5}
                        text="Review Peoples"
                        onPress={() => this.props.navigator.push({ routeName: 'review', params: event })}
                    />
                </View>
            );
        }

        if (meta.isOwner) {
            if (event.status === 'PENDING') {
                buttons.push(
                    <View key="edit-event" style={{ margin: 10 }}>
                        <Button
                            onPress={() => this.props.navigator.push({
                                routeName: 'event_info',
                                params: Object.assign({}, event)
                            })}
                            roundness={5}
                            width={this.props.device.getX(40)}
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
                                        return this.props.navigator.switchTo('event_list');
                                    }
                                })
                            }
                            roundness={5}
                            color="#CCCCCC"
                            width={this.props.device.getX(40)}
                            textStyle={{ color: 'white' }}
                            text="Delete Event"
                        />
                    </View>
                );
            }
        }

        return (
            <View style={{ alignItems: 'center', margin: 10 }}>
                {buttons}
            </View>
        );
    }

    renderCommentForm = (event, profile, meta) => {
        if (meta.isNormal || meta.isRequest || event.status === 'END') {
            return null;
        }
        return (
            <View>
                <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 19, fontWeight: 'bold' }}>Comments</Text>
                <Card style={{ ...this.props.device.marginXY(this.props.device.getX(5), this.props.device.getY(1.25)) }}>
                    <Card.Title
                        title={profile.name}
                        left={(props) => <Avatar.Image size={50} source={{ uri: this.props.api.cdn(profile.avatar) }} />}
                    />
                    <Card.Content>
                        <Form containerStyle={{ alignItems: 'center' }} formSetting={this.formSetting()} />
                    </Card.Content>
                    <Card.Actions style={{ justifyContent: 'flex-end' }}>
                        <Button
                            onPress={this.createComment}
                            loading={this.state.loading}
                            roundness={5}
                            textStyle={{ color: 'white' }}
                            text="SEND"
                        />
                    </Card.Actions>
                </Card>
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
                        width={this.props.device.getX(45)}
                        onPress={
                            () => this.props.showAlert({
                                title: 'Request Join',
                                content: '',
                                submit: async () => {
                                    try {
                                        await this.handleEventAction('REQUEST');
                                    } catch (error) {
                                        this.dataController.reload();
                                    }
                                }
                            })
                        }
                        text="Join Event"
                    />
                );
            }

            if (meta.isRequest) {
                buttons.push(
                    <Button
                        key="request-btn"
                        width={this.props.device.getX(45)}
                        text="Requesting ..."
                    />
                );
            }

            if (meta.isMember) {
                buttons.push(
                    <Button
                        key="member-btn"
                        width={this.props.device.getX(45)}
                        onPress={
                            () => this.props.showAlert({
                                title: 'Quit Event',
                                content: '',
                                submit: async () => {
                                    try {
                                        await this.handleEventAction('QUIT')
                                    } catch (error) {
                                        this.dataController.reload();
                                    }
                                }
                            })
                        }
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
                        width={this.props.device.getX(45)}
                        onPress={
                            () => this.props.showAlert({
                                title: 'Start Event',
                                content: '',
                                submit: async () => {
                                    try {
                                        await this.handleEventAction('START_EVENT')
                                    } catch (error) {
                                        alert(error);
                                        this.dataController.reload();
                                    }
                                }
                            })
                        }
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
                        width={this.props.device.getX(45)}
                        onPress={() => this.handleEventAction('CHECK_IN')}
                        text="Check In"
                    />
                );
            }
            if (meta.isOwner) {
                buttons.push(
                    <Button
                        key="end-btn"
                        width={this.props.device.getX(45)}
                        color="#ff0000"
                        onPress={
                            () => this.props.showAlert({
                                title: 'End Event',
                                content: '',
                                submit: () => this.handleEventAction('END_EVENT')
                            })
                        }
                        text="End Event"
                    />
                );
            }
        }

        if (buttons.length > 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        position: 'absolute',
                        bottom: 0,
                        width: this.props.device.getX(100)
                    }}
                >
                    {buttons}
                </View>
            );
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <AsyncContainer
                    controller={(ctl) => this.dataController = ctl}
                    promise={{
                        event: this.props.api.build('GET', `/events/${this.state.event.id}`),
                        comment: this.props.api.build('GET', `/events/${this.state.event.id}/comments?limit=4`),
                        meta: this.props.api.build('GET', `/events/${this.state.event.id}/meta`),
                        profile: this.props.api.build('GET', '/users/profile/me'),
                    }}
                >
                    {
                        ({ event, meta, profile, comment }) => {
                            const absoluteButton = this.renderButton(event, meta);
                            return (
                                <View style={{ flex: 1 }}>
                                    <PureList
                                        type="vertical"
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={this.state.refresh}
                                                enabled={true}
                                                onRefresh={
                                                    async () => {
                                                        this.setState({ refresh: true });
                                                        await this.dataController.reload();
                                                        this.setState({ refresh: false });
                                                    }
                                                }
                                            />
                                        }
                                        numColumns={1}
                                        containerStyle={{ marginBottom: absoluteButton && this.props.device.getY(7.5) }}
                                        header={
                                            <View style={{ flex: 1 }}>
                                                <Image
                                                    style={{ height: this.props.device.getY(25) }}
                                                    source={this.props.api.cdn(event.image)}
                                                />
                                                <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 19, fontWeight: 'bold' }}>{event.name}</Text>
                                                <PureList
                                                    type="horizontal"
                                                    containerStyle={{ marginLeft: this.props.device.getX(3) }}
                                                    data={[
                                                        moment(event.start_time).format('DD/MM/YYYY, HH:mm'),
                                                        event.location,
                                                        event.shop,
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
                                                {this.renderCommentForm(event, profile, meta)}
                                            </View>
                                        }
                                        footer={this.renderAction(event, meta)}
                                        data={[
                                            {
                                                user: { name: 'Event Description' },
                                                userId: event.organizerId,
                                                comment: event.desc,
                                                createdAt: event.createdAt
                                            },
                                            ...comment.result
                                        ]}
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
    withNavigator
)(EventDetailScreen);