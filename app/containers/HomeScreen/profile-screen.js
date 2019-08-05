import React from 'react';

import { Image, View, Text, ScrollView } from 'react-native';
import { Card, Avatar, Badge, Paragraph } from 'react-native-paper';
import Caccordion from '#components/Caccordion';
import QueryableList from '#components/QueryableList';
import Appbar from '#components/Appbar';
import AsyncContainer from '#components/AsyncContainer';
import PureList from '#components/PureList';

import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import { compose } from '#utility';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export class ProfileScreen extends React.PureComponent {
    state = {
        profile: new Promise(
            async (resolve, reject) => {
                const response = await this.props.api.request('GET', 'users/profile');
                if (response.ok) {
                    resolve(response.result);
                } else {
                    reject(response.message);
                }
            }
        ),
    }

    renderProfile = () => {
        return (
            <AsyncContainer promise={this.state.profile}>
                {({ id, gender, desc, constellation, name, utag, badge }) => (
                    <Caccordion
                        containerStyle={{ 
                            marginTop: 10,
                            marginLeft: this.props.device.getX(20),
                            marginRight: this.props.device.getX(20)
                        }}
                        collapsed={
                            <View>
                                <Text>{desc}</Text>
                            </View>
                        }
                    >
                        <View style={{ marginTop: 10, alignItems: 'center' }}>
                            <Avatar.Image
                                source={{ uri: this.props.api.cdn(`users-${id}`) }}
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
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-around' }}>
                            {
                                Object.keys(badge).map(
                                    (badge_name) => {
                                        const devicePixel = this.props.device.getX(17);
                                        return (
                                            <Image
                                                key={`badge-${badge_name}`}
                                                source={{ uri: this.props.api.staticResource(`/images/badges/${badge_name}.png`) }}
                                                resizeMethod="resize"
                                                style={{ width: devicePixel, height: devicePixel }}
                                            />
                                        );
                                    }
                                )
                            }
                        </View>
                    </Caccordion>
                )}
            </AsyncContainer>
        );
    }

    renderComments = () => {
        return (
            <Caccordion
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

    renderPersonality = () => {
        return (
            <AsyncContainer promise={this.state.profile}>
                {
                    ({ personality }) => {
                        return (
                            <Caccordion
                                title="Good At..."
                                containerStyle={{
                                    marginTop: 10,
                                    marginLeft: this.props.device.getX(10),
                                    marginRight: this.props.device.getX(10)
                                }}
                                showButton={true}
                                collapsed={<Text>None</Text>}
                            >
                                <PureList
                                    type="vertical"
                                    data={personality}
                                    numColumns={3}
                                    render={
                                        ({ item }) => (
                                            <Card style={{ flex: 1, margin: this.props.device.getX(2)}}>
                                                <Card.Content>
                                                    <Paragraph style={{ textAlign: 'center' }}>{item}</Paragraph>
                                                </Card.Content>
                                            </Card>
                                        )
                                    }
                                />
                            </Caccordion>
                        );
                    }
                }
            </AsyncContainer>
        );
    }

    renderEventHistory = () => {
        return (
            <Card
                style={{
                    marginTop: 10,
                    marginLeft: this.props.device.getX(10),
                    marginRight: this.props.device.getX(10)
                }}
            >
                <Card.Title title="Event History" titleStyle={{ fontSize: 15 }} />
                <Card.Content>
                    <QueryableList
                        type="vertical"
                        numColumns={2}
                        containerStyle={{ flex: 1 }}
                        initQuery={{ page: 1 }}
                        updateQuery={(query) => ({ page: query.page + 1 })}
                        uri={(query) => `https://randomuser.me/api?results=50&page=${query.page}`}
                        extract={(response) => response.results}
                        render={
                            ({ item }) => (
                                <Card style={{ flex: 1, margin: 5 }}>
                                    <Card.Cover 
                                        style={{ height: this.props.device.getY('15') }}
                                        source={{ uri: 'https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=1&w=500' }} 
                                    />
                                    <Card.Title
                                        title="Title"
                                        subtitle={<Text>subtitle</Text>}
                                        right={(props) => <Text>A</Text>}
                                    />
                                </Card>
                            )
                        }
                    />
                </Card.Content>
            </Card>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar profileBar={true} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginBottom: 10 }}>
                        { this.renderProfile() }
                        { this.renderPersonality() }
                        { this.renderComments() }
                        { this.renderEventHistory() }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const Screen = compose(withDevice, withAPI)(ProfileScreen);
Screen.navigationOptions = {
    tabBarIcon: <MaterialCommunityIcon size={25} name="face-profile" />
};

export default Screen;