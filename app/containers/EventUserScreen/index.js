import React from 'react';
import { View, BackHandler } from 'react-native';
import { Title, Avatar, List } from 'react-native-paper';

import Icon from '#components/Icon';
import Button from '#components/Button';
import AsyncContainer from '#components/AsyncContainer';
import Appbar from '#components/Appbar';

import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import withNavigator from '#extension/navigator';
import { compose } from '#utility';

export class EventUser extends React.Component {
    state = {
        event: this.props.navigation.state.params.event,
        meta: this.props.navigation.state.params.meta,
    }

    dataController = null

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

    handleBack = () => this.props.navigator.back()

    handleEventAction = async (action, user) => {
        await this.props.api.request(
            'POST', 
            `/events/${this.state.event.id}`, {
                action,
                user
            }
        );

        this.dataController.reload('users');
    }

    buildButton = ({ eventStatus, id }) => {
        if (!this.state.meta.isOwner) {
            return null;
        }

        if (eventStatus === 'REQUESTING') {
            return (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Button
                        onPress={() => this.handleEventAction('ACCEPT', id)}
                        text={<Icon color="#ffffff" package="entypo" name="check" size={25} />}
                    />
                    <Button
                        color="#ff0000"
                        onPress={() => this.handleEventAction('REJECT', id)}
                        text={<Icon color="#ffffff" package="entypo" name="cross" size={25} />}
                    />
                </View>
            );
        }

        if (eventStatus === 'MEMBER') {
            return (
                <Button
                    color="#ff0000"
                    onPress={() => this.handleEventAction('KICK', id)}
                    text={<Icon color="#ffffff" package="entypo" name="cross" size={25} />}
                />
            );
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <AsyncContainer
                    controller={ctl => this.dataController = ctl}
                    promise={{ users: this.props.api.build('GET', `/events/${this.state.event.id}/users` ) }}
                >
                    {
                        ({ users }) => {
                            const sections = {
                                OWNER: [],
                                REQUESTING: [],
                                MEMBER: [],
                                PARTICIPATED: [],
                            };
                            const keys = Object.keys(sections);

                            users.forEach(
                                (user) => {
                                    sections[user.eventStatus].push(
                                        <List.Item
                                            key={`users-${user.id}`}
                                            title={user.name}
                                            left={(props) => <Avatar.Image size={50} source={{ uri: this.props.api.cdn(`user-${user.id}`) }} />}
                                            right={(props) => this.buildButton(user)}
                                            onPress={
                                                () => this.props.navigator.push({
                                                    routeName: 'user_profile',
                                                    params: {
                                                        id: user.id,
                                                    }
                                                })
                                            }
                                        />
                                    );
                                }
                            );

                            return (
                                <View style={{ flex: 1 }}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', margin: 10 }}>
                                        <View style={{ flex: 1, alignItems: 'flex-start'}}>
                                            <Title style={{ fontSize: 15 }}>{this.state.event.name}</Title>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <Title style={{ fontSize: 13 }}>{users.length} Peoples</Title>
                                        </View>
                                    </View>
                                    {
                                        Object.values(sections).map(
                                            (section, index) => {
                                                if (section.length > 0) {
                                                    return (
                                                        <List.Section key={keys[index]} title={keys[index]}>
                                                            {section}
                                                        </List.Section>
                                                    );
                                                }
                                            }
                                        )
                                    }
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
    withNavigator
)(EventUser);