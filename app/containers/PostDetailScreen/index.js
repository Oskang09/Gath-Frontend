import React from 'react';

import { View, ScrollView, BackHandler, Text } from 'react-native';
import { Avatar, Card, Paragraph, Title, Caption, Portal, Dialog, Button } from 'react-native-paper';

import CustomButton from '#components/Button';
import Image from '#components/Image';
import Appbar from '#components/Appbar';
import AsyncContainer from '#components/AsyncContainer';

import { compose } from '#utility';
import withDevice from '#extension/device';
import withDialog from '#extension/dialog';
import withNavigator from '#extension/navigator';
import withAPI from '#extension/apisauce';
import withAlert from '#extension/alert';

import moment from 'moment';

export class PostDetailScreen extends React.PureComponent {

    state = {
        loading: false,
        currentVoucher: null,
        post: this.props.navigation.state.params,
        voucher: this.props.navigation.state.params.voucherId,
    }

    componentWillMount() {
        this._backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                this.props.navigator.switchTo('post_list');
                return true;
            }
        );
    }

    componentWillUnmount() {
        this._backHandler.remove();
    }

    receiveVoucher = () => this.props.showAlert({
        title: 'Receive Voucher',
        content: '',
        submit: async () => {
            try {
                await this.props.api.request('POST', `/users/voucher`, { voucher: this.state.voucher });
                this.props.showDialog('Received new voucher. Please view your voucher at profile.');
            } catch (error) {
                this.props.showDialog(error);
            }
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
                    text="Receive"
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
                        <Card.Cover source={{ uri: this.props.api.cdn(item.image) }} />
                        <Card.Content>
                            <Title style={{ fontSize: 16 }}>{item.title}</Title>
                            <Paragraph style={{ fontSize: 12 }}>{item.description}</Paragraph>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Caption style={{ color: 'red' }}>Expired at {moment(item.expiredAt).format('YYYY / MM / DD')}</Caption>
                            </View>
                        </Card.Content>
                        <Card.Actions style={{ justifyContent: 'flex-end' }}>
                            <Button onPress={this.receiveVoucher} style={{ flex: 1 }} mode="contained">
                                <Text style={{ color: '#ffffff' }}>RECEIVE</Text>
                            </Button>
                        </Card.Actions>
                    </Card>
                </Dialog>
            </Portal>
        );
    }

    renderStatus = ({ expiredAt }) => {
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
        const { post } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                {this.state.currentVoucher && this.renderPortalVoucher()}
                <ScrollView style={{ flex: 1 }}>
                    <Image
                        style={{ height: this.props.device.getY(25) }}
                        source={this.props.api.cdn(post.image)}
                        fallback={this.props.api.cdn(post.shop.image)}
                    />
                    <View style={{ margin: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Title style={{ fontSize: 16 }}>{post.title}</Title>
                        </View>
                        <Paragraph>{post.content}</Paragraph>
                        {
                            this.state.voucher && (
                                <AsyncContainer
                                    promise={{
                                        voucher: this.props.api.build('GET', `/vouchers/${this.state.voucher}`)
                                    }}
                                >
                                    {
                                        ({ voucher }) => {
                                            const status = this.renderStatus(voucher);
                                            return (
                                                <Card onPress={() => !status && this.setState({ currentVoucher: voucher })} style={{ elevation: 4, width: this.props.device.getX(80), marginTop: 20, alignSelf: 'center' }} theme={{ roundness: 15 }}>

                                                    <Image
                                                        style={{ height: this.props.device.getY(20) }}
                                                        component={Card.Cover}
                                                        source={this.props.api.cdn(voucher.image)}
                                                        fallback={this.props.api.cdn(voucher.shop.image)}
                                                    />
                                                    <Card.Title
                                                        left={(props) => <Avatar.Image source={{ uri: this.props.api.cdn(voucher.shop.image) }} size={40} />}
                                                        right={(props) => status}
                                                        title={voucher.title}
                                                        subtitle={voucher.description}
                                                        titleStyle={{ fontSize: 15 }}
                                                        subtitleStyle={{ fontSize: 11 }}
                                                    />
                                                </Card>
                                            );
                                        }
                                    }
                                </AsyncContainer>
                            )
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
};

export default compose(
    withDevice,
    withAPI,
    withDialog,
    withNavigator,
    withAlert
)(PostDetailScreen);