import React from 'react';

import { View, Text } from 'react-native';
import { FAB } from 'react-native-paper';
import Appbar from '#components/Appbar';
import PureList from '#components/PureList';
import AsyncContainer from '#components/AsyncContainer';
import EventCard from '#components/EventCard';

import { compose } from '#utility';
import withFirebase from '#extension/firebase';
import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';
import QueryableList from '#components/QueryableList';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export class EventScreen extends React.PureComponent {

    handleClickEventCard = (data) => {
        this.props.navigation.navigate({
            routeName: 'event_detail',
            params: data
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
                    () => this.props.navigation.navigate('event_info')
                }
            />
        );
    }

    renderOwnEvent = () => {
        return (
            <AsyncContainer
                promise={{
                    events: this.props.api.build('GET', '/events/me?limit=10')
                }}
            >
                {
                    ({ events }) => (
                        <PureList
                            type="horizontal"
                            data={events.result}
                            containerStyle={{ flex: 1 }}
                            render={
                                ({ item }) => (
                                    <EventCard type="horizontal" data={item} onPress={this.handleClickEventCard} />
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
                <Appbar search={true} />
                <QueryableList
                    type="vertical"
                    numColumns={1}
                    resetWhenRefresh="filter"
                    containerStyle={{ flex: 1, marginTop: 5 }}
                    initQuery={{ page: 1, type: '' }}
                    uri={(query) => `/events?page=${query.page}&type=${query.type}`}
                    filter={[
                        {
                            key: 'event-type',
                            name: 'type',
                            title: 'Type',
                            items: ['COOK', 'PLAY'],
                        }
                    ]}
                    header={
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>My Events</Text>
                            { this.renderOwnEvent() }
                            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Other Events</Text>
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

export default compose(withFirebase, withAPI, withDevice)(EventScreen);