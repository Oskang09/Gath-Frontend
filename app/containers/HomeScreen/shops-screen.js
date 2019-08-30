import React from 'react';
import moment from 'moment';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Card, List, Paragraph } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import QueryableList from '#components/QueryableList';
import Appbar from '#components/Appbar';
import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';

export class ShopScreen extends React.PureComponent {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <QueryableList
                    type="vertical"
                    numColumns={1}
                    containerStyle={{ flex: 1 }}
                    initQuery={{ page: 1 }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    uri={(query) => `/posts?page=${query.page}`}
                    filter={[
                        {
                            key: 'location',
                            title: 'Location',
                            items: ['1', '2'],
                            name: 'locate',
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
                            <TouchableOpacity onPress={() => { }}>
                                <View 
                                    style={{
                                        flex: 1,
                                        marginLeft: 20,
                                        marginRight: 20,
                                        marginTop: 10
                                    }}
                                >
                                    <Card>
                                        <Card.Cover source={{ uri: this.props.api.cdn(`post-${item.id}`) }} />
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
                                </View>
                            </TouchableOpacity>
                        )
                    }
                />
            </View>
        );
    }
};

export default compose(withDevice, withAPI)(ShopScreen);