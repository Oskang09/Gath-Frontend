import React from 'react';
import { View, Text } from 'react-native';

import Image from '#components/Image';
import Appbar from '#components/Appbar';
import QueryableList from '#components/QueryableList';
import ShopCard from '#components/ShopCard';

import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';

import { compose } from '#utility';

export class ShopList extends React.Component {
    
    handleClick = (item) => {
        this.props.nextStep({ shop: item });
    }

    render() {
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

export default compose(
    withAPI,
    withDevice,
)(ShopList);