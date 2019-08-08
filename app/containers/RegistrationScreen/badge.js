import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Button, Card } from 'react-native-paper';

import Appbar from '#components/Appbar';
import PureList from '#components/PureList';
import CarouselList from '#components/CarouselList';

import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import withError from '#extension/error';

export class Badge extends React.PureComponent {
    state = {
        data: [],
        loading: false,
    }
    listController = null

    toggle = (item) => {
        const { data } = this.state;
        if (data.includes(item)) {
            data.splice(data.indexOf(item), 1);
        } else {
            if (data.length < 4) {
                data.push(item);
            }
        }
        this.setState({ data }, () => this.listController && this.listController.refresh());
    }

    updateBadge = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true, error: null });
        try {
            const { api, navigation } = this.props;
            const response = await api.request(
                'POST',
                `/users/profile`,
                { badge: this.state.data, status: 'REGISTERED' }
            );
            if (response.ok) {
                navigation.navigate('home');
            } else {
                this.setState({ loading: false }, () => this.props.showError(response.message));
            }
        } catch (error) {
            this.setState({ loading: false }, () => this.props.showError(error));
        }
    }

    render() {
        const { data } = this.state;
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Appbar />
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', width: this.props.device.getX(100) }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', margin: 10 }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text>Badge represent you ...</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Button mode="contained" width={this.props.device.getX(25)} onPress={this.updateBadge}>
                                <Text style={{ color: 'white' }}>NEXT</Text>
                            </Button>
                        </View>
                    </View>
                    <PureList
                        type="vertical"
                        ref={(ctl) => this.listController = ctl}
                        data={this.props.api.getConfig().badges}
                        numColumns={4}
                        render={
                            ({ item }) => {
                                const devicePixel = this.props.device.getX(25);
                                return (
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.toggle(item)}>
                                        <Image
                                            source={{ uri: this.props.api.staticResource(`/images/badges/${item}.png`) }}
                                            resizeMethod="resize"
                                            style={{
                                                width: devicePixel,
                                                height: devicePixel,
                                                borderWidth: 0.5,
                                                borderColor: data.includes(item) ? 'black' : 'white'
                                            }}
                                        />
                                    </TouchableOpacity>
                                );
                            }
                        }
                    />
                    <CarouselList
                        data={this.props.api.getConfig().badges}
                        containerWidth={this.props.device.getX(50)}
                        itemWidth={this.props.device.getX(45)}
                        render={
                            ({ item }) => {
                                const devicePixel = this.props.device.getX(45);
                                return (
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.toggle(item)}>
                                        <Image
                                            source={{ uri: this.props.api.staticResource(`/images/badges/${item}.png`) }}
                                            resizeMethod="resize"
                                            style={{
                                                width: devicePixel,
                                                height: devicePixel,
                                                borderWidth: 0.5,
                                                borderColor: data.includes(item) ? 'black' : 'white'
                                            }}
                                        />
                                    </TouchableOpacity>
                                );
                            }
                        }
                    />
                </View>
            </View>
        );
    }
};

export default compose(
    withDevice,
    withAPI,
    withError
)(Badge);