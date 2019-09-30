import React from 'react';
import { View, BackHandler, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { Avatar, Card, Paragraph } from 'react-native-paper';
import moment from 'moment';

import Button from '#components/Button';
import Form from '#components/Form';
import PureList from '#components/PureList';
import AsyncContainer from '#components/AsyncContainer';
import Appbar from '#components/Appbar';

import { compose } from '#utility';
import withNavigator from '#extension/navigator';
import withTimer from '#extension/timer';
import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';
import withDialog from '#extension/dialog';

export class EventCommentScreen extends React.PureComponent {
    state = {
        event: this.props.navigation.state.params.event,
        comment: '',
    }
    dataController = null

    createComment = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });
        try {
            if (!this.state.comment || this.state.comment === '') {
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

    renderComments = ({ item, index }) => {
        return (
            <Card style={{ ...this.props.device.marginXY(this.props.device.getX(5), this.props.device.getY(1.25)) }}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={
                    () => (index !== 0 && this.props.api.getConfig().profile !== item.user.id) && this.props.navigator.push({
                        routeName: 'user_profile',
                        params: {
                            id: item.user.id,
                        }
                    })
                }
            >
                <Card.Title
                    title={item.user.name}
                    subtitle={moment(item.createdAt).format('ddd, HH:mm')}
                    left={
                        (props) => <Avatar.Image size={50} source={{ uri: this.props.api.cdn(item.user.avatar) }} />
                    }
                />
            </TouchableOpacity>
                <Card.Content>
                    <Paragraph>{item.comment}</Paragraph>
                </Card.Content>
            </Card>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <AsyncContainer
                    controller={(ctl) => this.dataController = ctl}
                    promise={{
                        comment: this.props.api.build('GET', `/events/${this.state.event.id}/comments`),
                        profile: this.props.api.build('GET', `/users/profile/me`),
                    }}
                >
                    {
                        ({ comment, profile }) => {
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
                                        header={
                                            this.state.event.status !== 'END' && (
                                                <View style={{ flex: 1 }}>
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
                                            )
                                        }
                                        data={[
                                            {
                                                user: {
                                                    name: 'Event Description',
                                                    avatar: this.state.event.image
                                                },
                                                userId: this.state.event.organizerId,
                                                comment: this.state.event.desc,
                                                createdAt: this.state.event.createdAt
                                            },
                                            ...comment.result
                                        ]}
                                        render={this.renderComments}
                                    />
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
    withAPI,
    withDevice,
    withTimer,
    withNavigator,
    withDialog
)(EventCommentScreen);