import React from 'react';
import { View, Text } from 'react-native';
import { Portal, Dialog } from 'react-native-paper';

import Button from '#components/Button';
import Form from '#components/Form';
import Image from '#components/Image';
import Appbar from '#components/Appbar';
import QueryableList from '#components/QueryableList';
import ShopCard from '#components/ShopCard';

export class ShopList extends React.Component {

    state = {
        shop: this.props.getState("shop") || "",
        location: this.props.getState("location") || "",
        custom: false,
    }
    
    listController = null
    handleClick = (item) => this.props.nextStep(item)

    formSetting = () => [
        {
            type: 'input',
            row: 0,
            dcc: (shop) => this.setState({ shop }),
            key: 'shop',
            props: {
                mode: 'outlined',
                width: this.props.device.getX(78),
            },
            setting: {
                label: 'Shop',
                value: this.state.shop
            }
        },
        {
            type: 'input',
            row: 1,
            dcc: (location) => this.setState({ location }),
            key: 'address',
            props: {
                mode: 'outlined',
                width: this.props.device.getX(78),
            },
            setting: {
                label: 'Address',
                value: this.state.location
            }
        }
    ]

    renderCustomDialog = () => {
        return (
            <Portal>
                <Dialog dismissable={false} visible={this.state.custom}>
                    <Dialog.Title>Enter shop details</Dialog.Title>
                    <Dialog.ScrollArea>
                        <Form
                            containerStyle={{ alignItems: 'center' }}
                            rowStyle={{ flexDirection: 'row', margin: 5 }}
                            formSetting={this.formSetting()} 
                        />
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button
                            color="#CCCCCC"
                            onPress={() => this.setState({ custom: false })}
                            textStyle={{ color: 'white' }}
                            text="Cancel"
                            style={{ marginRight: 5 }}
                            roundness={5}
                        />
                        <Button
                            onPress={() => this.handleClick({ shop: this.state.shop, location: this.state.location })}
                            text="Done"
                            roundness={5}
                        />
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        )
    }

    render() {
        const selectedShop = this.props.getState();
        return (
            <View style={{ flex: 1 }}>
                <Appbar
                    onSearchChange={
                        (name) => this.listController.updateQuery({ name }, "filter")
                    }
                    search={true}
                />
                { this.renderCustomDialog() }
                <QueryableList
                    type="vertical"
                    key="all-shop"
                    controller={ctl => this.listController = ctl}
                    numColumns={2}
                    resetWhenRefresh="filter"
                    initQuery={{ page: 1, name: null, type: '', name: '' }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    containerStyle={{ flex: 1, margin: 5 }}
                    uri={
                        (query) => `/shops?page=${query.page}&limit=10&type=${query.type}&name=${query.name}`
                    }
                    filter={[
                        {
                            key: 'shop-type',
                            name: 'type',
                            title: 'Type',
                            items: this.props.api.getConfig().shopType
                        }
                    ]}
                    header={
                        <View>
                            {
                                selectedShop && (
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
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                <View style={{ flex: 1, alignItems: 'flex-start'}}>
                                    <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Shop List</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                                    <Button
                                        mode="contained"
                                        style={{ alignSelf: 'flex-end' }}
                                        roundness={5}
                                        onPress={() => this.setState({ custom: true })}
                                        text="Custom"
                                    />
                                </View>
                            </View>
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