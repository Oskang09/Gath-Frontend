import React from 'react';
import { View, Image, Text, BackHandler } from 'react-native';
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

import QueryableList from '#components/QueryableList';
import Appbar from '#components/Appbar';
import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import withBack from '#extension/backhandler';

export class VoucherScreen extends React.PureComponent {
    state = {
        currentVoucher: null
    }

    useVoucher = async () => {
        const voucher = this.state.currentVoucher;
        await this.props.api.request('POST', '/users/voucher', { voucher: voucher.id });
        this.dismissDialog();
    }

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
                <Dialog visible={item} dismissable={false} theme={{ roundness: 15 }}>
                    <Card style={{ elevation: 4 }}>
                        <Card.Cover source={{ uri: this.props.api.cdn(`voucher-${item.id}`) }} />
                        <Card.Content>
                            <Title style={{ fontSize: 15 }}>{item.title}</Title>
                            <Paragraph style={{ fontSize: 11 }}>{item.description}</Paragraph>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Caption style={{ color: 'red' }}>Expired at {moment(item.expiredAt).format('YYYY / MM / DD')}</Caption>
                            </View>
                        </Card.Content>
                        <Card.Actions style={{ justifyContent: 'flex-end' }}>
                            <Button onPress={this.useVoucher} style={{ flex: 1 }} mode="contained">ACTIVATE</Button>
                        </Card.Actions>
                    </Card>
                </Dialog>
            </Portal>
        );
    }

    render() {
        const width = this.props.device.getX(80);
        const height = this.props.device.getY(20);
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Appbar home={true} profileBar={true} />
                { this.state.currentVoucher && this.renderPortalVoucher() }
                <QueryableList
                    type="vertical"
                    numColumns={1}
                    containerStyle={{ flex: 1 }}
                    initQuery={{ page: 1 }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    uri={(query) => `/users/voucher?limit=5&page=${query.page}`}
                    footer={
                        <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                            <Image style={{ width: 64, height: 64 }} source={require('#assets/fail.png')} />
                            <Text>There is no more ...</Text>
                        </View>
                    }
                    render={
                        ({ item }) => (
                            <Card onPress={() => this.setState({ currentVoucher: item })} style={{ elevation: 4, width, marginTop: 20 }} theme={{ roundness: 15 }}>
                                <Card.Cover style={{ height }} source={{ uri: this.props.api.cdn(`voucher-${item.id}`) }} />
                                <Card.Title
                                    left={(props) => <Avatar.Image source={{ uri: this.props.api.cdn(`shop-${item.shopId}`) }} size={40} />}
                                    title={item.title}
                                    subtitle={item.description}
                                    titleStyle={{ fontSize: 15 }}
                                    subtitleStyle={{ fontSize: 11 }}
                                />
                            </Card>
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
    withBack('profile'),
)(VoucherScreen);