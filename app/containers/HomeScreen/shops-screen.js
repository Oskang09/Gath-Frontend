import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import PureList from '#components/PureList';
import { Card, Chip } from 'react-native-paper';
import Appbar from './appbar';

import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';

import EntypoIcon from 'react-native-vector-icons/Entypo';

class ShopScreen extends React.PureComponent {
    state = {
        filter: [],
    }
    filterController = null

    toggle = (item) => {
        const { filter } = this.state;
        if (filter.includes(item)) {
            filter.splice(filter.indexOf(item), 1);
        } else {
            filter.push(item);
        }
        this.setState({ filter }, this.filterController.refresh);
    }

    render() {
        const { filter } = this.state;
        const { device } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Appbar />
                <PureList
                    type="vertical"
                    numColumns={1}
                    containerStyle={{ flex: 1 }}
                    header={
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text>Filter</Text>
                            <PureList
                                type="horizontal"
                                controller={(ctl) => this.filterController = ctl}
                                containerStyle={{ flex: 1 }}
                                data={[ 'test', 'test2' ]}
                                render={
                                    ({ item }) => (
                                        <Chip
                                            mode="outlined"
                                            style={{
                                                backgroundColor: filter.includes(item) ?
                                                    device.primaryColor :
                                                    'white'
                                            }}
                                            theme={{
                                                colors: {
                                                    text: filter.includes(item) ?
                                                        'white' :
                                                        'black'
                                                }
                                            }}
                                            onPress={() => this.toggle(item)}
                                        >
                                            { item }
                                        </Chip>
                                    )
                                }
                            />
                        </View>
                    }
                    footer={
                        <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                            <Text>End here</Text>
                        </View>
                    }
                    data={[1,2,3]}
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