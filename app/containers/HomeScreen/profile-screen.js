import React from 'react';

import { View, Text, ScrollView } from 'react-native';
import { Avatar } from 'react-native-paper';
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
import { compose, concatRender } from '#utility';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export class ProfileScreen extends React.PureComponent {

    renderProfile = ({ profile }) => {
        const { id, gender, desc, constellation, name, utag, badge } = profile;
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
                <View style={{ marginTop: 10, alignItems: 'center' }}>
                    <Avatar.Image
                        source={{ uri: this.props.api.cdn(`user-${id}`) }}
                        size={64}
                    />
                    <Text>{name}</Text>
                    <Text>@{utag}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                    <Avatar.Icon
                        style={{ marginRight: 10 }}
                        size={32}
                        icon={
                            () => <MaterialCommunityIcon size={16} name={`gender-${gender.toLowerCase()}`} />
                        }
                    />
                    <Avatar.Icon
                        style={{ marginRight: 10 }}
                        size={32}
                        icon={
                            () => <MaterialCommunityIcon size={16} name={`zodiac-${constellation.toLowerCase()}`} />
                        }
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    {
                        badges.map(
                            (badge_name, index) => {
                                const devicePixel = this.props.device.getX(17);
                                return (
                                    <Image
                                        key={`badge-${badge_name}-${index}`}
                                        source={this.props.api.staticResource(`/images/badges/${badge_name}.png`)}
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

    renderComments = ({ profile }) => {
        return (
            <Caccordion
                key="comment"
                title="Comments"
                subtitle={(open) => !open && "15 badge votes, 20 comments"}
                containerStyle={{
                    marginTop: 10,
                    marginLeft: this.props.device.getX(10),
                    marginRight: this.props.device.getX(10)
                }}
                showButton={true}
                collapsed={
                    <View>
                        <Text>Something</Text>
                        <Text>Somethi1ng</Text>
                        <Text>Somethi1ng</Text>
                        <Text>Somethi1ng</Text>
                        <Text>Somethi1ng</Text>
                        <Text>Somethi1ng</Text>
                        <Text>Somethi1ng</Text>
                        <Text>Somethi1ng</Text>
                    </View>
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
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                <Button
                    key="logout"
                    roundness={5}
                    onPress={
                        async () => {
                            await this.props.firebase.logout();
                            this.props.navigation.navigate('splash');
                        }
                    }
                    text="Logout"
                />
                <Button
                    key="update-profile"
                    roundness={5}
                    onPress={
                        () => this.props.navigation.navigate({
                            routeName: 'update_profile',
                            params: profile
                        })
                    }
                    text="Edit"
                />
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar profileBar={true} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginBottom: 10 }}>
                        <AsyncContainer promise={{ profile: this.props.api.build('GET', 'users/profile') }}>
                            {
                                concatRender([ 
                                    this.renderProfile,
                                    this.renderPersonality,
                                    this.renderComments,
                                    this.renderButton
                                ])
                            }
                        </AsyncContainer>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default compose(withDevice, withAPI, withFirebase)(ProfileScreen);