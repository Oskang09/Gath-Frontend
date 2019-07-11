import React from 'react';
import withFirebase from '#extension/firebase';
import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';

import FlatPaginator from '#components/FlatPaginator';
import { View, Text, Image, Animated, ScrollView } from 'react-native';
import { compose } from '#utility';
import { Searchbar, Card, Appbar } from 'react-native-paper';

export class EventScreen extends React.PureComponent {
    state = {
        data: this.props.api.request('GET', '/events'),
        searchQuery: '',
        searchButton: true,
        searchWidth: new Animated.Value(0),
    }
    searchRef = null

    render() {
        const { searchQuery, searchButton, searchWidth } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Appbar>
                    <Appbar.Content title="Gath" />
                    {
                        !searchButton && 
                        <Searchbar
                            ref={ref => this.searchRef = ref}
                            style={{ width: searchWidth }}
                            placeholder="Search something ..."
                            onChangeText={searchQuery => this.setState({ searchQuery })}
                            value={searchQuery}
                        />
                    }
                    {
                        searchButton ?
                            <Appbar.Action
                                icon="search"
                                size={25}
                                onPress={
                                    () => {
                                        const this2 = this;
                                        this.setState({ searchButton: false });
                                        Animated.timing(
                                            searchWidth, 
                                            {
                                                toValue: this.props.device.getX(75),
                                                duration: 750,
                                            }
                                        ).start(() => {
                                            if (this2.searchRef) {
                                                this2.searchRef.focus();
                                            }
                                        });
                                    }
                                }
                            /> 
                            :
                            <Appbar.Action
                                icon="cancel"
                                size={25}
                                onPress={
                                    () => {
                                        const this2 = this;
                                        Animated.timing(
                                            searchWidth,
                                            { 
                                                toValue: 0,
                                                duration: 750,
                                            }
                                        ).start(() => {
                                            this2.setState({ searchButton: true });
                                        });
                                    }
                                }
                            />
                    }
                </Appbar>
                <FlatPaginator
                    type="topDown"
                    numColumns={2}
                    containerStyle={{ flex: 1 }}
                    uri={(page) => `https://randomuser.me/api?results=50&page=${page}`}
                    filter={(response) => response.results}
                    header={
                        <View style={{ flex: 1 }}>
                            <Text>Testing</Text>
                            <FlatPaginator
                                type="leftRight"
                                key="event"
                                containerStyle={{ flex: 1 }}
                                uri={(page) => `https://randomuser.me/api?results=50&page=${page}`}
                                filter={(response) => response.results}
                                render={
                                    ({ item }) => (
                                        <Card style={{ margin: 10 }} width={this.props.device.getX('33')}>
                                            <Card.Cover 
                                                style={{ height: this.props.device.getY('15') }}
                                                source={{ uri: 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500' }} 
                                            />
                                            <Card.Title
                                                title="Title"
                                                subtitle={<Text>subtitle</Text>}
                                                right={(props) => <Text>A</Text>}
                                            />
                                        </Card>
                                    )
                                }
                            />
                            <Text>Testing</Text>
                            <FlatPaginator
                                type="leftRight"
                                key="recently"
                                containerStyle={{ flex: 1 }}
                                uri={(page) => `https://randomuser.me/api?results=50&page=${page}`}
                                filter={(response) => response.results}
                                render={
                                    ({ item }) => (
                                        <Card style={{ margin: 10 }} width={this.props.device.getX('33')}>
                                            <Card.Cover 
                                                style={{ height: this.props.device.getY('15') }}
                                                source={{ uri: 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500' }} 
                                            />
                                            <Card.Title
                                                title="Title"
                                                subtitle={<Text>subtitle</Text>}
                                                right={(props) => <Text>A</Text>}
                                            />
                                        </Card>
                                    )
                                }
                            />
                        </View>
                    }
                    render={
                        ({ item }) => (
                            <View style={{ flex: 1, borderColor: 'red', borderWidth: 1, margin: 20 }}>
                                <Image style={{ width: 25, height: 25 }} source={{ uri: item.picture.thumbnail }} />
                                <Text>{item.email}</Text>
                            </View>
                        )
                    }
                />
            </View>
        );
    }
};

export default compose(
    withFirebase,
    withAPI,
    withDevice
)(EventScreen);