import React from 'react';

import { View, Text, ScrollView, BackHandler, RefreshControl } from 'react-native';
import { Avatar, List, Portal, Dialog } from 'react-native-paper';
import PureList from '#components/PureList';
import Button from '#components/Button';
import Caccordion from '#components/Caccordion'
import Appbar from '#components/Appbar';
import AsyncContainer from '#components/AsyncContainer';
import PersonalityCard from '#components/PersonalityCard';
import Image from '#components/Image';

import withFirebase from '#extension/firebase'
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import withNavigator from '#extension/navigator';
import { compose, concatRender } from '#utility';

export class ProfileScreen extends React.PureComponent {
    state = {
        id: this.props.navigation.state.params ? this.props.navigation.state.params.id : 'me',
        isOwner: this.props.navigation.state.params ? false : true,
        refresh: false,
    }

    dataController = null

    componentWillMount() {
        if (this.props.navigation.state.params) {
            this._backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    this.props.navigator.back();
                    return true;
                }
            );
        }
    }

    componentWillUnmount() {
        if (this._backHandler) {
            this._backHandler.remove();
        }
    }

    renderProfile = ({ profile }) => {
        const { id, gender, desc, constellation, name, utag, badge } = profile;
        const devicePixel = this.props.device.getX(17);
        const badges = Object.keys(badge);
        if (badges.length < 4) {
            for (let i = badges.length; i < 4; i++) {
                badges.push('empty-badge');
            }
        }
        return (
            <Caccordion
                key="profile"
                containerStyle={{
                    marginTop: 10,
                    marginLeft: this.props.device.getX(20),
                    marginRight: this.props.device.getX(20)
                }}
                collapsedStyle={{
                    marginTop: 10,
                    marginLeft: this.props.device.getX(10),
                    marginRight: this.props.device.getX(10)
                }}
                collapsed={
                    <View>
                        <Text>{desc}</Text>
                    </View>
                }
            >
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Avatar.Image
                        source={{ uri: this.props.api.cdn(`user-${id}`) }}
                        size={64}
                    />
                    <Text>{name}</Text>
                    <Text>@{utag}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Image
                        key={`gender-${gender}`}
                        source={this.props.api.staticResource(`/images/gender/${gender.toLowerCase()}.png`)}
                        resizeMethod="resize"
                        style={{ width: devicePixel, height: devicePixel }}
                    />
                    <Image
                        key={`constellation-${constellation}`}
                        source={this.props.api.staticResource(`/images/constellation/${constellation.toLowerCase()}.png`)}
                        resizeMethod="resize"
                        style={{ width: devicePixel, height: devicePixel }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    {
                        badges.map(
                            (badge_name, index) => (
                                <Image
                                    key={`badge-${badge_name}-${index}`}
                                    source={this.props.api.staticResource(`/images/badges/${badge_name}.webp`)}
                                    resizeMethod="resize"
                                    style={{ width: devicePixel, height: devicePixel }}
                                />
                            )
                        )
                    }
                </View>
            </Caccordion>
        );
    }

    renderReviews = ({ review }) => {
        return (
            <Caccordion
                key="review"
                title="Reviews"
                subtitle={`${review.numsOfBadge} badge votes, ${review.numsOfComment} comments`}
                containerStyle={{
                    marginTop: 10,
                    marginLeft: this.props.device.getX(10),
                    marginRight: this.props.device.getX(10)
                }}
                collapsed={
                    (close) => (
                        <Portal>
                            <Dialog
                                visible={true}
                                onDismiss={close}
                            >
                                <Dialog.Title>Reviews</Dialog.Title>
                                <Dialog.ScrollArea>
                                    <AsyncContainer
                                        promise={{
                                            reviews: this.props.api.build('GET', `/users/review/${this.state.id}?full=true`)
                                        }}
                                    >
                                        {
                                            ({ reviews }) => {
                                                if (reviews.length === 0) {
                                                    // render nothing
                                                }
                                                return reviews.map(
                                                    (review, index) => (
                                                        <List.Item
                                                            key={`review-${index}`}
                                                            title={review.fromUser.name}
                                                            description={review.comment}
                                                            left={
                                                                (props) =>  <Avatar.Image {...props} size={50} source={{ uri: this.props.api.cdn(`user-${review.fromUser.id}`) }} />
                                                            }
                                                            right={
                                                                (props) => <Image style={{ ...props, width: 75, height: 75 }} source={this.props.api.staticResource(`/images/badges/${review.badge}.webp`)} />
                                                            }
                                                        />
                                                    )
                                                );
                                            }
                                        }
                                    </AsyncContainer>
                                </Dialog.ScrollArea>
                            </Dialog>
                        </Portal>
                    )
                }
            />
        )
    }

    renderPersonality = ({ profile }) => {
        const { personality } = profile;
        return (
            <View key="personality">
                <PureList
                    type="horizontal"
                    data={personality}
                    render={
                        ({ item }) => (
                            <PersonalityCard name={item} data={this.props.api.getConfig().personality[item]} />
                        )
                    }
                />
            </View>
        );
    }

    renderButton = ({ profile }) => {
        return (
            <View key="buttons" style={{ flex: 1, flexDirection: 'column', alignItems: 'center', margin: 10 }}>
                <Button
                    key="update-profile"
                    icon="edit"
                    roundness={5}
                    width={this.props.device.getX(30)}
                    onPress={
                        () => this.props.navigator.switchTo({
                            routeName: 'update_profile',
                            params: profile
                        })
                    }
                    text="Edit"
                />
                <View style={{ marginTop: 10 }}>
                    <Button
                        key="logout"
                        roundness={5}
                        width={this.props.device.getX(30)}
                        color="#CCCCCC"
                        onPress={
                            async () => {
                                await this.props.firebase.logout();
                                this.props.navigator.switchTo('splash');
                            }
                        }
                        text="Logout"
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar profileBar={true} profileId={this.state.id} />
                <ScrollView
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refresh}
                            enabled={true}
                            onRefresh={
                                async () => {
                                    this.setState({ refresh: true });
                                    await this.dataController.reload();
                                    this.setState({ refresh: false });
                                }
                            }
                        />
                    }
                >
                    <View style={{ marginBottom: 10 }}>
                        <AsyncContainer
                            controller={ctl => this.dataController = ctl}
                            promise={{
                                profile: this.props.api.build('GET', `/users/profile/${this.state.id}?badge=true`),
                                review: this.props.api.build('GET', `/users/review/${this.state.id}`)
                            }}
                        >
                            {
                                concatRender([
                                    this.renderProfile,
                                    this.renderPersonality,
                                    this.renderReviews,
                                    this.state.isOwner && this.renderButton
                                ])
                            }
                        </AsyncContainer>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default compose(
    withDevice,
    withAPI,
    withFirebase,
    withNavigator
)(ProfileScreen);