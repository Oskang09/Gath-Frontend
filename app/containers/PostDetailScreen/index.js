import React from 'react';

import { View, ScrollView } from 'react-native';
import { Avatar, Card, Paragraph, Title } from 'react-native-paper';

import Image from '#components/Image';
import Appbar from '#components/Appbar';
import AsyncContainer from '#components/AsyncContainer';

import { compose } from '#utility';
import withDevice from '#extension/device';
import withDialog from '#extension/dialog';
import withAPI from '#extension/apisauce';
import withBack from '#extension/backhandler';

export class PostDetailScreen extends React.PureComponent {

    state = {
        loading: false,
        post: this.props.navigation.state.params,
        voucher: this.props.navigation.state.params.voucherId && 
            this.props.api.request('GET', `/vouchers/${this.props.navigation.state.params.voucherId}`)
    }

    receiveVoucher = async (voucher) => {
        try {
            const result = await this.props.api.request('POST', `/users/voucher`, { voucher: voucher.id });
            this.props.showDialog('Received new voucher. Please view your voucher at profile.');
        } catch (error) {
            this.props.showDialog(error);
        }
    }

    render() {
        const { post, voucher } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Appbar home={true} />
                <ScrollView style={{ flex: 1 }}>
                    <Image
                        style={{ height: this.props.device.getY(25) }}
                        source={this.props.api.cdn(`post-${post.id}`)}
                        fallback={this.props.api.cdn(`shop-${post.shopId}`)}
                    />
                    <View style={{ margin: 10 }}>
                        <Title>{post.title}</Title>
                        <Paragraph>{post.content}</Paragraph>

                        <AsyncContainer promise={voucher}>
                            {
                                (result) => (
                                    <Card onPress={() => this.receiveVoucher(result)} style={{ elevation: 4, width: this.props.device.getX(80), marginTop: 20, alignSelf: 'center' }} theme={{ roundness: 15 }}>
                                        <Card.Cover style={{ height: this.props.device.getY(20) }} source={{ uri: this.props.api.cdn(`voucher-${result.id}`) }} />
                                        <Card.Title
                                            left={(props) => <Avatar.Image source={{ uri: this.props.api.cdn(`shop-${result.shopId}`) }} size={40} />}
                                            title={result.title}
                                            subtitle={result.description}
                                            titleStyle={{ fontSize: 15 }}
                                            subtitleStyle={{ fontSize: 11 }}
                                        />
                                    </Card>
                                )
                            }
                        </AsyncContainer>
                    </View>
                </ScrollView>
            </View>
        );
    }
};

export default compose(
    withBack('post_list'),
    withDevice,
    withAPI,
    withDialog,
)(PostDetailScreen);