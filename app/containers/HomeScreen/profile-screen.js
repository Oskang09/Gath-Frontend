import React from 'react';

import moment from 'moment';
import { View, Text, ScrollView, BackHandler, RefreshControl } from 'react-native';
import { Avatar, Card, Paragraph } from 'react-native-paper';
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
import withAlert from '#extension/alert';
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
        const { gender, desc, constellation, name, utag, badge, avatar } = profile;
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
                    marginLeft: this.props.device.getX(8),
                    marginRight: this.props.device.getX(8)
                }}
                collapsed={
                    <View>
                        <Text>{desc}</Text>
                    </View>
                }
            >
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Avatar.Image
                        source={{ uri: this.props.api.cdn(avatar) }}
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
                            (badge_name, index) => {
                                return (
                                    <Image
                                        key={`badge-${badge_name}-${index}`}
                                        source={this.props.api.staticResource(`/images/badges/${badge_name}.webp`)}
                                        resizeMethod="resize"
                                        style={{ width: devicePixel, height: devicePixel }}
                                    />
                                );
                            }
                        )
                    }
                </View>
            </Caccordion>
        );
    }

    renderReviews = ({ reviewMeta, reviews }) => {
        return (
            <Card
                key="review-card"
                style={{ marginTop: 10, marginLeft: this.props.device.getX(8), marginRight: this.props.device.getX(8) }}
                onPress={
                    () => reviews.result.length > 0 && this.props.navigator.push({
                        routeName: 'user_review',
                        params: {
                            id: this.state.id
                        }
                    })
                }
            >
                <Card.Title
                    title="Reviews"
                    subtitle={`${reviewMeta.numsOfBadge} badge votes, ${reviewMeta.numsOfComment} comments`}
                />
                <Card.Content>
                    {
                        reviews.result.map(
                            (review, index) => (
                                <Card key={`review-${index}`}>
                                    <Card.Title
                                        title={review.fromUser.name}
                                        titleStyle={{ fontSize: 16 }}
                                        subtitle={moment(review.createdAt).format('DD/MM/YYYY HH:mm')}
                                        subtitleStyle={{ fontSize: 12 }}
                                        left={
                                            (props) => <Avatar.Image size={50} source={{ uri: this.props.api.cdn(review.fromUser.avatar) }} />
                                        }
                                        right={
                                            (props) => <Image style={{ width: 75, height: 75 }} source={this.props.api.staticResource(`/images/badges/${review.badge}.webp`)} />
                                        }
                                    />
                                    <Card.Content>
                                        <Paragraph>{review.comment}</Paragraph>
                                    </Card.Content>
                                </Card>
                            )
                        )
                    }
                </Card.Content>
            </Card>
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
                            async () => this.props.showAlert({
                                title: 'Logout',
                                content: 'After logout you will require login to access application.',
                                customSubmit: (submit, isLoading) => (
                                    <Button
                                        roundness={5}
                                        color="#CCCCCC"
                                        onPress={submit}
                                        loading={isLoading}
                                        text="Logout"
                                    />
                                ),
                                submit: async () => {
                                    await this.props.firebase.logout();
                                    this.props.navigator.switchTo('splash');
                                }
                            })
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
                                reviewMeta: this.props.api.build('GET', `/users/review/${this.state.id}?meta=true`),
                                reviews: this.props.api.build(`GET`, `/users/review/${this.state.id}?limit=3`)
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
    withNavigator,
    withAlert
)(ProfileScreen);