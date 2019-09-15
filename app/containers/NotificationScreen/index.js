import React from 'react';
import { View, Image, BackHandler } from 'react-native';
import { List } from 'react-native-paper';

import { compose } from '#utility';
import Appbar from '#components/Appbar';
import withNavigator from '#extension/navigator';

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

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar profileBar={true} />
                <List.Item
                    title="Text"
                    right={
                        () => (
                            <Image
                                style={{ width: 128, height: 64 }}
                                source={{ uri: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/37B5/production/_89716241_thinkstockphotos-523060154.jpg' }}
                            />
                        )
                    }
                />
                <List.Item
                    title="Text"
                    right={
                        () => (
                            <Image
                                style={{ width: 128, height: 64 }}
                                source={{ uri: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/37B5/production/_89716241_thinkstockphotos-523060154.jpg' }}
                            />
                        )
                    }
                />
                <List.Item
                    title="Text"
                    right={
                        () => (
                            <Image
                                style={{ width: 128, height: 64 }}
                                source={{ uri: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/37B5/production/_89716241_thinkstockphotos-523060154.jpg' }}
                            />
                        )
                    }
                />
                <List.Item
                    title="Text"
                    right={
                        () => (
                            <Image
                                style={{ width: 128, height: 64 }}
                                source={{ uri: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/37B5/production/_89716241_thinkstockphotos-523060154.jpg' }}
                            />
                        )
                    }
                />
            </View>
        );
    }
};

export default compose(withNavigator)(NotificationScreen);