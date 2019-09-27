import React from 'react';
import { View, Text, BackHandler } from 'react-native';
import {
    Card,
    Avatar,
    Portal,
    Dialog,
    Button,
    Title,
    Paragraph,
    Caption
} from 'react-native-paper';
import moment from 'moment';

import Image from '#components/Image';
import CustomButton from '#components/Button';
import QueryableList from '#components/QueryableList';
import Appbar from '#components/Appbar';
import { compose } from '#utility';
import withAlert from '#extension/alert';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import withNavigator from '#extension/navigator';

export class VoucherScreen extends React.PureComponent {
    state = {
        currentVoucher: null
    }

    componentWillMount() {
        this._backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                this.props.navigator.switchTo('profile');
                return true;
            }
        );
    }

    componentWillUnmount() {
        this._backHandler.remove();
    }

    useVoucher = () => this.props.showAlert({
        title: 'Activate Voucher',
        content: 'Activate voucher cannot be undone, after used will not able to recover back.',
        submit: async () => {
            await this.props.api.request('DELETE', '/users/voucher', { voucher: this.state.currentVoucher.voucher.id });
            this.dismissDialog();
        },
        customSubmit: (onPress, isLoading) => {
            return (
                <CustomButton
                    width={this.props.device.getX(25)}
                    mode="contained"
                    roundness={5}
                    onPress={onPress}
                    loading={isLoading}
                    text="Activate"
                />
            );
        }
    });

    dismissDialog = () => {
        this._dialogBack.remove();
        this.setState({ currentVoucher: null });
        return true;
    }

    renderPortalVoucher = () => {
        this._dialogBack = BackHandler.addEventListener('hardwareBackPress', this.dismissDialog);
        const item = this.state.currentVoucher;
        return (
            <Portal>
                <Dialog visible={true} dismissable={false} theme={{ roundness: 15 }}>
                    <Card style={{ elevation: 4 }}>
                        <Image
                            component={Card.Cover}
                            source={this.props.api.cdn(item.voucher.image)}
                            fallback={this.props.api.cdn(item.voucher.shop.image)}
                        />
                        <Card.Content>
                            <Title style={{ fontSize: 16 }}>{item.voucher.title}</Title>
                            <Paragraph style={{ fontSize: 12 }}>{item.voucher.description}</Paragraph>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Caption style={{ color: 'red' }}>Expired at {moment(item.voucher.expiredAt).format('YYYY / MM / DD')}</Caption>
                            </View>
                        </Card.Content>
                        <Card.Actions style={{ justifyContent: 'flex-end' }}>
                            <Button onPress={this.useVoucher} style={{ flex: 1 }} mode="contained">
                                <Text style={{ color: '#ffffff' }}>ACTIVATE</Text>
                            </Button>
                        </Card.Actions>
                    </Card>
                </Dialog>
            </Portal>
        );
    }

    renderStatus = ({ usedAt, voucher: { expiredAt } }) => {
        if (usedAt) {
            return (
                <Image
                    style={{ width: 50, height: 50, margin: 10 }}
                    resizeMode="contain"
                    source={require('#assets/used.png')}
                />
            );
        }

        if (Date.now() > new Date(expiredAt)) {
            return (
                <Image
                style={{ width: 50, height: 50, margin: 10 }}
                    resizeMode="contain"
                    source={require('#assets/expired.png')}
                />
            );
        }
        return null;
    }

    render() {
        const width = this.props.device.getX(80);
        const height = this.props.device.getY(20);
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                { this.state.currentVoucher && this.renderPortalVoucher() }
                <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 19, fontWeight: 'bold' }}>Vouchers</Text>
                <QueryableList
                    type="vertical"
                    numColumns={1}
                    containerStyle={{ flex: 1, alignSelf: 'center' }}
                    initQuery={{ page: 1 }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    uri={(query) => `/users/voucher/me?limit=5&page=${query.page}`}
                    footer={
                        <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                            <Image style={{ width: 64, height: 64 }} source={require('#assets/fail.png')} />
                            <Text>There is no more ...</Text>
                        </View>
                    }
                    render={
                        ({ item }) => {
                            const status = this.renderStatus(item);
                            return (
                                <Card onPress={() => !status && this.setState({ currentVoucher: item })} style={{ elevation: 4, width, marginTop: 20 }} theme={{ roundness: 15 }}>
                                    <Image
                                        style={{ height }}
                                        component={Card.Cover}
                                        source={this.props.api.cdn(item.voucher.image)}
                                        fallback={this.props.api.cdn(item.voucher.shop.image)}
                                    />
                                    <Card.Title
                                        left={(props) => <Avatar.Image source={{ uri: this.props.api.cdn(item.voucher.shop.image) }} size={40} />}
                                        right={(props) => status}
                                        title={item.voucher.title}
                                        subtitle={item.voucher.description}
                                        titleStyle={{ fontSize: 15 }}
                                        subtitleStyle={{ fontSize: 11 }}
                                    />
                                </Card>
                            );
                        }
                    }
                />
            </View>
        );
    }
};

export default compose(
    withAPI,
    withDevice,
    withAlert,
    withNavigator
)(VoucherScreen);