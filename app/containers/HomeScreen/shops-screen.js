import React from 'react';
import moment from 'moment';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, List, Paragraph } from 'react-native-paper';
import EntypoIcon from 'react-native-vector-icons/Entypo';
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
                    resetWhenRefresh={true}
                    numColumns={1}
                    containerStyle={{ flex: 1 }}
                    initQuery={{ page: 1 }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    uri={(query) => `/posts?test=true`}
                    extract={(response) => response.result}
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
                            <Text>End here</Text>
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
                                        <Card.Cover source={{ uri: this.props.api.cdn(`post-${item.id}.jpg`) }} />
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



const Screen = compose(withDevice, withAPI)(ShopScreen);
Screen.navigationOptions = {
    tabBarIcon: <EntypoIcon size={25} name="newsletter" />
};
export default Screen;