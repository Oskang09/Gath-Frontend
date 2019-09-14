import React from 'react';

import { View, Text, Image } from 'react-native';

import Appbar from '#components/Appbar';
import EventCard from '#components/EventCard';
import QueryableList from '#components/QueryableList';

import { compose } from '#utility';
import withBack from '#extension/backhandler';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';

export class EventHistory extends React.PureComponent {

    handleClickEventCard = (data) => {
        this.props.navigation.navigate({
            routeName: 'event_detail',
            params: {
                event: data,
                from : 'history'
            }
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar home={true} profileBar={true} />
                <QueryableList
                    type="vertical"
                    numColumns={1}
                    resetWhenRefresh="filter"
                    containerStyle={{ flex: 1, marginTop: 5 }}
                    initQuery={{ page: 1 }}
                    uri={(query) => `/history?page=${query.page}`}
                    header={
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Event Histories</Text>
                        </View>
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
            </View>
        );
    }
};

export default compose(
    withDevice,
    withAPI,
    withBack('profile'),
)(EventHistory);