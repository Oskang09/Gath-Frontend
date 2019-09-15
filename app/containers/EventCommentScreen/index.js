import React from 'react';
import { View, BackHandler, Text } from 'react-native';
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

export class EventCommentScreen extends React.PureComponent {
    state = {
        event: this.props.navigation.state.params.event,
    }
    dataController = null

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

    componentWillMount() {
        this._backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                this.props.navigator.back();
                return true;
            }
        );
        this.props.addTimer(
            'INTERVAL',
            'event-comment',
            () => {
                this.dataController.reload('comment')
            },
            10
        );
    }
    
    componentWillUnmount() {
        this._backHandler.remove();
        this.props.removeTimer('event-comment');
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

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar home={true} />
                <AsyncContainer
                    controller={(ctl) => this.dataController = ctl}
                    promise={{
                        comment: this.props.api.build('GET', `/events/${this.state.event.id}/comments`),
                        profile: this.props.api.build('GET', `/users/profile`),
                    }}
                >
                    {
                        ({ comment, profile }) => {
                            return (
                                <View style={{ flex: 1 }}>
                                    <PureList
                                        type="vertical"
                                        numColumns={1}
                                        header={
                                            this.state.event.status !== 'END' && (
                                                <View style={{ flex: 1 }}>
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
                                            )
                                        }
                                        data={[
                                            {
                                                user: { name: 'Event Description' },
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
    withNavigator
)(EventCommentScreen);