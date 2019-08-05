import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import QueryableList from '#components/QueryableList';
import Appbar from '#components/Appbar';

import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';

import EntypoIcon from 'react-native-vector-icons/Entypo';

export class ShopScreen extends React.PureComponent {
    state = {
        posts: this.props.api.request('GET', '/posts')
    }
    listController = null

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <QueryableList
                    ref={(ref) => this.listController = ref}
                    type="vertical"
                    resetWhenRefresh={true}
                    numColumns={1}
                    containerStyle={{ flex: 1 }}
                    initQuery={{ page: 1 }}
                    updateQuery={(query) => ({ page: query.page + 1 })}
                    uri={(query) => `/posts`}
                    extract={(response) => response.result}
                    filter={[
                        {
                            key: 'location',
                            title: 'Location',
                            items: [ '1', '2' ],
                            name: 'locate',
                        }
                    ]}
                    footer={
                        <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                            <Text>End here</Text>
                        </View>
                    }
                    render={
                        ({ item }) => (
                            <TouchableOpacity onPress={() => {}}>
                                <View style={{ 
                                    flex: 1, 
                                    marginLeft: 20, 
                                    marginRight: 20,
                                    marginTop: 20
                                }}>
                                    <Card>
                                        <Card.Cover source={{ uri: '' }} />
                                        <Card.Content>
                                            <Text>Testing</Text>
                                        </Card.Content>
                                    </Card>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                />
            </View>
        );
    }
};



const Screen = compose(withDevice, withAPI)(ShopScreen);
Screen.navigationOptions = {
    tabBarIcon: <EntypoIcon size={25} name="newsletter" />
};
export default Screen;