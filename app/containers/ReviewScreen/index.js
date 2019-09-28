import React from 'react';
import { View, BackHandler, TouchableWithoutFeedback, Image, Text } from 'react-native';
import { Avatar, Card, Portal, Dialog } from 'react-native-paper';

import ErrorView from '#components/Error';
import PureList from '#components/PureList';
import Button from '#components/Button';
import Form from '#components/Form';
import AsyncContainer from '#components/AsyncContainer';
import Appbar from '#components/Appbar';

import { compose } from '#utility';
import withNavigator from '#extension/navigator';
import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';
import withDialog from '#extension/dialog';

export class ReviewScreen extends React.PureComponent {

    state = {
        loading: false,
        event: this.props.navigation.state.params,
        user: null,
        comment: '',
        badge: 'empty-badge',
        selectBadge: false,
    }

    dataController = null

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

    handleSubmit = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true })
        try {
            await this.props.api.request('POST', '/reviews', {
                target: this.state.user,
                event: this.state.event.id,
                badge: this.state.badge,
                comment: this.state.comment
            });
            return this.dataController.reload('users');
        } catch (error) {
            this.props.showDialog(error);
        }
    }

    renderBadgeDialog = () => (
        <Portal>
            <Dialog visible={this.state.selectBadge} onDismiss={() => this.setState({ selectBadge: false })}>
                <Dialog.Title>Select badge</Dialog.Title>
                <Dialog.ScrollArea>
                    <PureList
                        type="vertical"
                        numColumns={3}
                        data={this.props.api.getConfig().badges}
                        render={
                            ({ item }) => (
                                <TouchableWithoutFeedback activeOpacity={1} onPress={() => this.setState({ badge: item, selectBadge: false })}>
                                    <Image
                                        source={{ uri: this.props.api.staticResource(`/images/badges/${item}.webp`) }}
                                        resizeMethod="resize"
                                        style={{ flex: 1, width: null, height: this.props.device.getY(15) }}
                                    />
                                </TouchableWithoutFeedback>
                            )
                        }
                    />
                </Dialog.ScrollArea>
            </Dialog>
        </Portal>
    )

    renderDisplay = (item, index) => {
        const isForm = this.state.user === item.id;
        return (
            <Card
                key={`review-${index}`}
                style={{ ...this.props.device.marginXY(this.props.device.getX(5), this.props.device.getY(1.25)) }}
                onPress={() => this.setState({ user: isForm ? null : item.id })}
            >
                <Card.Title
                    title={item.name}
                    subtitle={'@' + item.utag}
                    left={
                        (props) => <Avatar.Image size={50} source={{ uri: this.props.api.cdn(item.avatar) }} />
                    }
                    right={
                        (props) => isForm && (
                            <TouchableWithoutFeedback onPress={() => this.setState({ selectBadge: true })}>
                                <Image style={{ width: 75, height: 75 }} source={{ uri: this.props.api.staticResource(`/images/badges/${this.state.badge}.webp`) }} />
                            </TouchableWithoutFeedback>
                        )
                    }
                />
                {
                    isForm && (
                        <>
                            <Card.Content>
                                <Form containerStyle={{ alignItems: 'center' }} formSetting={this.formSetting()} />
                            </Card.Content>
                            <Card.Actions style={{ justifyContent: 'flex-end' }}>
                                <Button
                                    loading={this.state.loading}
                                    onPress={this.handleSubmit}
                                    roundness={5}
                                    textStyle={{ color: 'white' }}
                                    text="SEND"
                                />
                            </Card.Actions>
                        </>
                    )
                }
            </Card>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                { this.renderBadgeDialog() }
                <Text style={{ marginTop: 10, marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Event Review</Text>
                <AsyncContainer
                    controller={(ctl) => this.dataController = ctl}
                    promise={{ users: this.props.api.build('GET', `/reviews/${this.state.event.id}`) }}
                >
                    {
                        ({ users }) => {
                            if (!users) {
                                return <ErrorView />
                            }
                            if (users.length === 0) {
                                return <ErrorView error="You completed your reviews." />;
                            }
                            return users.map(this.renderDisplay);
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
    withNavigator,
    withDialog
)(ReviewScreen);