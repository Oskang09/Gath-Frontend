import React from 'react';
import { View, Text } from 'react-native';

import FilterBar from '#components/FilterBar';
import Appbar from '#components/Appbar';
import QueryableList from '#components/QueryableList';
import ShopCard from '#components/ShopCard';

import withError from '#extension/error';
import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';

import { compose } from '#utility';

export class ShopList extends React.Component {
    typeFilter = null

    handleClick = (item) => {
        this.props.nextStep({ shop: item });
    }

    renderFilter = () => (
        <FilterBar
            ref={ref => this.type = ref}
            title="Type"
            items={[
                'Food', 'High Rated', 'Drink'
            ]}
        />
    )

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <QueryableList
                    type="vertical"
                    key="all-shop"
                    numColumns={2}
                    initQuery={{ page: 1 }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    containerStyle={{ flex: 1, margin: 5 }}
                    uri={(query) => `/shops`}
                    extract={(response) => response.result}
                    header={
                        <View>
                            { this.renderFilter() }
                            <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: 'bold' }}>Shop List</Text>
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
    withError
)(ShopList);