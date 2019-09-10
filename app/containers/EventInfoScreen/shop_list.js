import React from 'react';
import { View, Text } from 'react-native';

import Image from '#components/Image';
import Appbar from '#components/Appbar';
import QueryableList from '#components/QueryableList';
import ShopCard from '#components/ShopCard';

export class ShopList extends React.Component {
    
    handleClick = (item) => {
        this.props.nextStep(item);
    }

    render() {
        const selectedShop = this.props.getState();
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <QueryableList
                    type="vertical"
                    key="all-shop"
                    numColumns={2}
                    initQuery={{ page: 1, limit: 4 }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    containerStyle={{ flex: 1, margin: 5 }}
                    uri={(query) => `/shops?page=${query.page}&limit=${query.limit}&type=${query.type}`}
                    filter={[
                        {
                            key: 'shop-type',
                            name: 'type',
                            title: 'Type',
                            items: [
                                'Food', 'Drink'
                            ]
                        }
                    ]}
                    header={
                        <View>
                            {
                                Object.keys(selectedShop).length > 0 && (
                                    <>
                                        <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Selected Shop</Text>
                                        <ShopCard
                                            type="vertical"
                                            onPress={() => this.handleClick(selectedShop)}
                                            data={selectedShop}
                                        />
                                    </>
                                )
                            }
                            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Shop List</Text>
                        </View>
                    }
                    footer={
                        <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                            <Image style={{ width: 64, height: 64 }} source={require('#assets/fail.png')} />
                            <Text>There is no more ...</Text>
                        </View>
                    }
                    render={
                        ({ item }) => (
                            <ShopCard
                                type="vertical"
                                onPress={() => this.handleClick(item)}
                                data={item}
                            />
                        )
                    }
                />
            </View>
        );
    }
};

export default ShopList;