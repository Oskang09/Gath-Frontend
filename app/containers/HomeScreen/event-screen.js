import React from 'react';

import { View, Text, Image } from 'react-native';
import { FAB } from 'react-native-paper';

import Appbar from '#components/Appbar';
import PureList from '#components/PureList';
import AsyncContainer from '#components/AsyncContainer';
import EventCard from '#components/EventCard';

import { compose } from '#utility';
import withFirebase from '#extension/firebase';
import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';
import withNavigator from '#extension/navigator';
import QueryableList from '#components/QueryableList';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export class EventScreen extends React.PureComponent {

    listController = null

    handleClickEventCard = (event) => {
        this.props.navigator.push({
            routeName: 'event_detail',
            params: event
        });
    }
    
    renderFAB = () => {
        return (
            <FAB
                style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
                icon={
                    (props) => <MaterialIcon {...props} color="#ffffff" name="add"/>
                }
                small={true}
                onPress={
                    () => this.props.navigator.push('event_info')
                }
            />
        );
    }

    renderOwnEvent = () => {
        return (
            <AsyncContainer promise={{ events: this.props.api.build('GET', '/users/event/me?limit=10') }}>
                {
                    ({ events }) => (
                        <PureList
                            type="horizontal"
                            data={events.result}
                            containerStyle={{ flex: 1 }}
                            render={
                                ({ item }) => (
                                    <EventCard type="horizontal" data={item.event} onPress={this.handleClickEventCard} />
                                )
                            }
                        />
                    )
                }
            </AsyncContainer>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar
                    onSearchChange={
                        (name) => this.listController.updateQuery({ name }, 'filter')
                    }
                    search={true}
                />
                <QueryableList
                    type="vertical"
                    controller={ctl => this.listController = ctl}
                    numColumns={1}
                    resetWhenRefresh="filter"
                    containerStyle={{ flex: 1, marginTop: 5 }}
                    initQuery={{ page: 1, type: '', name: '' }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    uri={
                        (query) => `/events?page=${query.page}&type=${query.type}&name=${query.name}&limit=10`
                    }
                    filter={[
                        {
                            key: 'event-type',
                            name: 'type',
                            title: 'Type',
                            items: this.props.api.getConfig().eventType,
                        }
                    ]}
                    header={
                        (query) => query.name === "" ? (
                            <View style={{ flex: 1 }}>
                                <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>My Events</Text>
                                { this.renderOwnEvent() }
                                <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Other Events</Text>
                            </View>
                        ) : (
                            <View style={{ flex: 1 }}>
                                <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Search Result</Text>
                            </View>
                        )
                    }
                    footer={
                        <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                            <Image style={{ width: 64, height: 64 }} source={require('#assets/fail.png')} />
                            <Text>There is no more ...</Text>
                        </View>
                    }
                    render={
                        ({ item }) => (
                            <EventCard type="vertical" data={item} onPress={this.handleClickEventCard} />
                        )
                    }
                />
                { this.renderFAB() }
            </View>
        );
    }
};

export default compose(withFirebase, withAPI, withDevice, withNavigator)(EventScreen);