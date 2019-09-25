import React from 'react';

import { View, Text, Image, BackHandler } from 'react-native';

import Appbar from '#components/Appbar';
import EventCard from '#components/EventCard';
import QueryableList from '#components/QueryableList';

import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import withNavigator from '#extension/navigator';

export class EventHistory extends React.PureComponent {

    handleClickEventCard = (event) => {
        this.props.navigator.push({
            routeName: 'event_detail',
            params: event
        });
    }

    componentWillMount() {
        this._backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                this.props.navigation.state.params && this.props.navigation.state.params.id ?
                    this.props.navigator.back() :
                    this.props.navigator.switchTo('profile');
                return true;
            }
        );
    }

    componentWillUnmount() {
        this._backHandler.remove();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <QueryableList
                    type="vertical"
                    numColumns={1}
                    resetWhenRefresh="filter"
                    containerStyle={{ flex: 1, marginTop: 5 }}
                    initQuery={{ page: 1 }}
                    uri={(query) => `/history?page=${query.page}&limit=10`}
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
    withNavigator
)(EventHistory);