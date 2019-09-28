import React from 'react';
import { View, BackHandler, Image, Text } from 'react-native';
import { Avatar, Card, Paragraph } from 'react-native-paper';

import QueryableList from '#components/QueryableList';
import Appbar from '#components/Appbar';

import { compose } from '#utility';
import withNavigator from '#extension/navigator';
import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';
import withDialog from '#extension/dialog';

export class UserReviewScreen extends React.PureComponent {

    state = {
        id: this.props.navigation.state.params.id,
    }

    dataController = null

    componentWillMount() {
        this._backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                this.props.navigator.back();
                return true;
            }
        );
    }

    componentWillUnmount() {
        this._backHandler.remove();
    }

    renderDisplay = ({ item, index }) => {
        return (
            <Card
                key={`review-${index}`}
                style={{ ...this.props.device.marginXY(this.props.device.getX(5), this.props.device.getY(1.25)) }}
            >
                <Card.Title
                    title={item.fromUser.name}
                    subtitle={'@' + item.fromUser.utag}
                    left={
                        (props) => <Avatar.Image size={50} source={{ uri: this.props.api.cdn(item.fromUser.avatar) }} />
                    }
                    right={
                        (props) => item.badge !== 'empty-badge' && <Image style={{ width: 75, height: 75 }} source={{ uri: this.props.api.staticResource(`/images/badges/${item.badge}.webp`) }} />
                    }
                />
                <Card.Content>
                    <Paragraph>{item.comment}</Paragraph>
                </Card.Content>
            </Card>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <QueryableList
                    type="vertical"
                    numColumns={1}
                    containerStyle={{ flex: 1, marginTop: 5 }}
                    initQuery={{ page: 1 }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    uri={(query) => `/users/review/${this.state.id}?page=${query.page}&limit=10`}
                    header={
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Your reviews</Text>
                        </View>
                    }
                    footer={
                        <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                            <Image style={{ width: 64, height: 64 }} source={require('#assets/fail.png')} />
                            <Text>There is no more ...</Text>
                        </View>
                    }
                    render={this.renderDisplay}
                />
            </View>
        );
    }
};

export default compose(
    withAPI,
    withDevice,
    withNavigator,
    withDialog
)(UserReviewScreen);