import React from 'react';
import { View, BackHandler } from 'react-native';
import { List } from 'react-native-paper';

import { compose } from '#utility';
import Appbar from '#components/Appbar';
import AsyncContainer from '#components/AsyncContainer';
import PureList from '#components/PureList';
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
                <Appbar profileBar={true} />
                <AsyncContainer promise={{ notification: this.props.api.build('GET', '/users/notification?limit=10') }}>
                    {
                        ({ notification }) => (
                            <PureList
                                type="vertical"
                                data={notification.result}
                                containerStyle={{ flex: 1 }}
                                render={
                                    ({ item, index }) => (
                                        <List.Item
                                            key={`notify-${index}`}
                                            description={item.about}
                                            onPress={this.buildHandler(item)}
                                        />
                                    )
                                }
                            />
                        )
                    }
                </AsyncContainer>
            </View>
        );
    }
};

export default compose(
    withNavigator,
    withAPI
)(NotificationScreen);