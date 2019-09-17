import React from 'react';
import { View, BackHandler, TouchableWithoutFeedback, Image } from 'react-native';
import { Avatar, Card, Portal, Dialog } from 'react-native-paper';

import PureList from '#components/PureList';
import Button from '#components/Button';
import Form from '#components/Form';
import AsyncContainer from '#components/AsyncContainer';
import Appbar from '#components/Appbar';

import { compose } from '#utility';
import withNavigator from '#extension/navigator';
import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';

export class ReviewScreen extends React.PureComponent {

    state = {
        event: this.props.navigation.state.params,
        open: null,
        badge: 'empty-badge',
        selectBadge: false,
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

    renderBadgeDialog = () => (
        <Portal>
            <Dialog visible={this.state.selectBadge} dismissable={false}>
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
        const isForm = this.state.open === item.id;
        return (
            <Card
                key={`review-${index}`}
                style={{ ...this.props.device.marginXY(this.props.device.getX(5), this.props.device.getY(1.25)) }}
                onPress={() => this.setState({ open: isForm ? null : item.id })}
            >
                <Card.Title
                    title={item.name}
                    subtitle={'@' + item.utag}
                    left={
                        (props) => <Avatar.Image size={50} source={{ uri: this.props.api.cdn(`user-${item.id}`) }} />
                    }
                    right={
                        (props) => isForm && <Image style={{ width: 75, height: 75 }} source={{ uri: this.props.api.staticResource(`/images/badges/${this.state.badge}.webp`) }} />
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
                                    onPress={() => this.setState({ selectBadge: true })}
                                    roundness={5}
                                    width={this.props.device.getX(20)}
                                    textStyle={{ color: 'white' }}
                                    text="SELECT BADGE"
                                />
                                <Button
                                    onPress={() => { }}
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
                <AsyncContainer
                    controller={(ctl) => this.dataController = ctl}
                    promise={{ users: this.props.api.build('GET', `/reviews/${this.state.event.id}`) }}
                >
                    {
                        ({ users }) => users.map(this.renderDisplay)
                    }
                </AsyncContainer>
            </View>
        );
    }
};

export default compose(
    withAPI,
    withDevice,
    withNavigator
)(ReviewScreen);