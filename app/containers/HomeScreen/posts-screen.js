import React from 'react';
import moment from 'moment';
import { View, Text, RefreshControl } from 'react-native';
import { Card, List, Paragraph } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import QueryableList from '#components/QueryableList';
import Appbar from '#components/Appbar';
import Image from '#components/Image';
import { compose } from '#utility';
import withDevice from '#extension/device';
import withNavigator from '#extension/navigator';
import withAPI from '#extension/apisauce';

export class PostScreen extends React.PureComponent {

    listController = null
    handlePostDetail = (data) => {
        this.props.navigator.push({
            routeName: 'post_detail',
            params: data
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar search={true} />
                <QueryableList
                    type="vertical"
                    controller={ctl => this.listController = ctl}
                    numColumns={1}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            enabled={true}
                            onRefresh={
                                () => this.listController.updateQuery({ page: 1 }, 'manual')
                            }
                        />
                    }
                    resetWhenRefresh={[ "filter", "manual" ]}
                    containerStyle={{ flex: 1 }}
                    initQuery={{ page: 1, type: '' }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    uri={(query) => `/posts?page=${query.page}&type=${query.type}&limit=10`}
                    filter={[
                        {
                            key: 'post-type',
                            name: 'type',
                            title: 'Type',
                            items: this.props.api.getConfig().postType,
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
                                <Image
                                    component={Card.Cover}
                                    source={this.props.api.cdn(item.image)}
                                    fallback={this.props.api.cdn(item.shop.image)}
                                />
                                <List.Item
                                    title={item.title}
                                    titleStyle={{ fontSize: 16 }}
                                    description={
                                        (props) => {
                                            return (
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <MaterialIcon size={14} style={{ marginRight: 5 }} name="clock-outline" />
                                                        <Paragraph style={{ fontSize: 12 }}>{moment(item.createdAt).format('DD/MM/YYYY')}</Paragraph>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 7 }}>
                                                        <MaterialIcon size={14} style={{ marginRight: 5 }} name="store" />
                                                        <Paragraph style={{ fontSize: 12 }}>{item.shop.name}</Paragraph>
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

export default compose(withDevice, withAPI, withNavigator)(PostScreen);