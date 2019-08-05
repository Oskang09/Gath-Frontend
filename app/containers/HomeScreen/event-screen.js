import React from 'react';

import { View, Text } from 'react-native';
import { Card, FAB } from 'react-native-paper';
import Appbar from '#components/Appbar';

import { compose } from '#utility';
import withFirebase from '#extension/firebase';
import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';
import QueryableList from '#components/QueryableList';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export class EventScreen extends React.PureComponent {
    state = {
        data: this.props.api.request('GET', '/events'),
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
                    () => this.props.navigation.navigate('create_event')
                }
            />
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar search={true} />
                <QueryableList
                    type="vertical"
                    numColumns={2}
                    containerStyle={{ flex: 1, marginTop: 5 }}
                    initQuery={{ page: 1 }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    uri={(query) => `https://randomuser.me/api?results=50&page=${query.page}`}
                    extract={(response) => response.results}
                    header={
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: 'bold' }}>My Events</Text>
                            <QueryableList
                                type="horizontal"
                                key="event"
                                initQuery={{ page: 1 }}
                                updateQuery={(query) => ({ page: query.page + 1 })}
                                containerStyle={{ flex: 1 }}
                                resetWhenRefresh={true}
                                uri={(query) => `https://randomuser.me/api?results=50&page=${query.page}`}
                                extract={(response) => response.results}
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
                            <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: 'bold' }}>Participated Events</Text>
                            <QueryableList
                                type="horizontal"
                                key="recently"
                                initQuery={{ page: 1 }}
                                updateQuery={(query) => ({ page: query.page + 1 })}
                                containerStyle={{ flex: 1 }}
                                resetWhenRefresh={true}
                                uri={(query) => `https://randomuser.me/api?results=50&page=${query.page}`}
                                extract={(response) => response.results}
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
                            <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: 'bold' }}>Other Events</Text>
                        </View>
                    }
                    render={
                        ({ item }) => (
                            <Card style={{ flex: 1, margin: 10 }}>
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
                { this.renderFAB() }
            </View>
        );
    }
};

const Screen = compose(withFirebase, withAPI, withDevice)(EventScreen);
Screen.navigationOptions = {
    tabBarIcon: <MaterialIcon size={25} name="library-books" />
};

export default Screen;