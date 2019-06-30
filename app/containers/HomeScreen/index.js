import React from 'react';
import withFirebase from '#extension/firebase';
import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';
import AsyncContainer from '#components/AsyncContainer/';

// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View, Text, ScrollView } from 'react-native';
import { compose } from '#utility';
import { Button, Searchbar, Card, Title, Paragraph } from 'react-native-paper';

export class HomeScreen extends React.PureComponent {
    static navigationOptions = {
        title: 'Home Title',
    };

    state = {
        data: this.props.api.request('GET', '/events'),
        searchQuery: ''
    }

    render() {
        const { searchQuery } = this.state;
        return (
            <ScrollView
                stickyHeaderIndices={[0]}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Searchbar
                        placeholder="Search something ..."
                        onChangeText={searchQuery => this.setState({ searchQuery })}
                        value={searchQuery}
                    />
                </View>
                <View>
                    <Text>Recently</Text>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            padding: 15
                        }}
                    >
                        <AsyncContainer promise={this.state.data}>
                            {(data) => {
                                alert(JSON.stringify(data));
                                return (
                                <Card width={this.props.device.getX('33')}>
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
                        }}
                        </AsyncContainer>
                    </ScrollView>
                </View>
            </ScrollView>
        );
    }
};

export default compose(
    withFirebase,
    withAPI,
    withDevice
)(HomeScreen);