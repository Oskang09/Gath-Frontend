import React from 'react';
import moment from 'moment';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, List, Paragraph } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import QueryableList from '#components/QueryableList';
import Appbar from '#components/Appbar';
import Image from '#components/Image';
import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';

export class PostScreen extends React.PureComponent {

    handlePostDetail = (data) => {
        this.props.navigation.navigate({
            routeName: 'post_detail',
            params: data
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <QueryableList
                    type="vertical"
                    numColumns={1}
                    resetWhenRefresh="filter"
                    containerStyle={{ flex: 1 }}
                    initQuery={{ page: 1, type: '' }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    uri={(query) => `/posts?page=${query.page}&type=${query.type}&limit=5`}
                    filter={[
                        {
                            key: 'shop-type',
                            name: 'type',
                            title: 'Type',
                            items: ['FOOD', 'WATER'],
                        }
                    ]}
                    footer={
                        <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                            <Image style={{ width: 64, height: 64 }} source={require('#assets/fail.png')} />
                            <Text>There is no more ...</Text>
                        </View>
                    }
                    render={
                        ({ item }) => (
                            <Card
                                onPress={() => this.handlePostDetail(item)}
                                style={{ flex: 1, marginLeft: 20, marginRight: 20, marginTop: 10 }}
                            >
                                <Image component={Card.Cover} source={this.props.api.cdn(`post-${item.id}`)} fallback={this.props.api.cdn(`shop-${item.shopId}`)} />
                                <List.Item
                                    title={item.title}
                                    titleStyle={{ fontSize: 15 }}
                                    description={
                                        (props) => {
                                            return (
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <MaterialIcon size={14} style={{ marginRight: 5 }} name="clock-outline" />
                                                        <Paragraph style={{ fontSize: 11 }}>{moment(item.createdAt).format('DD/MM/YYYY')}</Paragraph>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 7 }}>
                                                        <MaterialIcon size={14} style={{ marginRight: 5 }} name="store" />
                                                        <Paragraph style={{ fontSize: 11 }}>{item.shop.name}</Paragraph>
                                                    </View>
                                                </View>
                                            );
                                        }
                                    }
                                />
                            </Card>
                        )
                    }
                />
            </View>
        );
    }
};

export default compose(withDevice, withAPI)(PostScreen);