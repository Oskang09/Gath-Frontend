import React from 'react';
import { View, Image } from 'react-native';
import { List } from 'react-native-paper';
import Appbar from '#components/Appbar';

export class NotificationScreen extends React.PureComponent {
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

export default NotificationScreen;