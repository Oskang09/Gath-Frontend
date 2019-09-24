import React from 'react';
import { View, BackHandler, Image, Text } from 'react-native';
import { List } from 'react-native-paper';

import { compose } from '#utility';
import QueryableList from "#components/QueryableList";
import Appbar from '#components/Appbar';
import withNavigator from '#extension/navigator';
import withAPI from '#extension/apisauce';

export class NotificationScreen extends React.PureComponent {

    componentWillMount() {
        this._backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                this.props.navigator.switchTo('profile');
                return true;
            }
        );
    }

    componentWillUnmount() {
        this._backHandler.remove();
    }

    buildHandler = (item) => {
        if (item.action === 'VIEW_EVENT') {
            return () => this.props.navigator.push({
                routeName: 'event_detail',
                params: item.event
            });
        }

        if (item.action === 'REVIEW') {
            return () => this.props.navigator.push({
                routeName: 'review',
                params: item.event
            });
        }
        return null;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <QueryableList
                    type="vertical"
                    numColumns={1}
                    containerStyle={{ flex: 1, marginTop: 5 }}
                    initQuery={{ page: 1 }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    uri={(query) => `/users/notification/me?page=${query.page}&limit=10`}
                    header={
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Notification</Text>
                        </View>
                    }
                    footer={
                        <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                            <Image style={{ width: 64, height: 64 }} source={require('#assets/fail.png')} />
                            <Text>There is no more ...</Text>
                        </View>
                    }
                    render={
                        ({ item, index }) => (
                            <List.Item
                                key={`notify-${index}`}
                                description={item.about}
                                right={
                                    (props) => (
                                        <Image
                                            style={{ width: 64, height: 64 }}
                                            source={{ uri: this.props.api.cdn(`event-${item.event}`) }}
                                        />
                                    )
                                }
                                onPress={this.buildHandler(item)}
                            />
                        )
                    }
                />
            </View>
        );
    }
};

export default compose(
    withNavigator,
    withAPI
)(NotificationScreen);