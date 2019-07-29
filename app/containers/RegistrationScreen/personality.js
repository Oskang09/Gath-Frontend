import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Card, Paragraph, Appbar, Button } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

import PureList from '#components/PureList';
import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';

export class Personality extends React.PureComponent {
    state = {
        data: [],
        loading: false,
        error: null,
    }
    listController = null

    toggle = (item) => {
        const { data } = this.state;
        if (data.includes(item)) {
            data.splice(data.indexOf(item), 1);
        } else {
            data.push(item);
        }
        this.setState({ data }, () => this.listController && this.listController.refresh());
    }

    updatePersonality = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true, error: null });
        try {
            const { api, navigation } = this.props;
            const response = await api.request(
                'POST', 
                `/users/profile`,
                { personality: this.state.data }
            );
            if (response.ok) {
                navigation.navigate('introduction');
            } else {
                this.setState({ loading: false, error: response.message });
            }
        } catch (error) {
            this.setState({ loading: false, error });
        }
    }

    render() {
        const { data } = this.state;
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Appbar>
                    <Appbar.Content title="Gath" />
                </Appbar>
                <View style={{ flex: 1, flexDirection: 'column', }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', margin: 10 }}>
                        <View style={{ flex: 1, alignItems: 'flex-start'}}>
                            <Text>I'm good at ...</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Button mode="contained" width={this.props.device.getX(25)} onPress={this.updatePersonality}>
                                <Text style={{ color: 'white' }}>NEXT</Text>
                            </Button>
                        </View>
                    </View>
                    <PureList
                        type="vertical"
                        controller={(ctl) => this.listController = ctl}
                        data={[
                            'Listener', 'Listener2', 'Listener3', 'Listener4'
                        ]}
                        numColumns={3}
                        render={
                            ({ item }) => (
                                <TouchableOpacity activeOpacity={1} onPress={() => this.toggle(item)}>
                                    <Card
                                        width={this.props.device.getX(25)}
                                        style={{ margin: this.props.device.getX(2), height: 80 }}
                                    >
                                        <Card.Title
                                            style={{ marginRight: 5, height: 30 }}
                                            right={
                                                () => data.includes(item) && <AntDesign color={this.props.device.primaryColor} name="checkcircle" size={15} />
                                            }
                                        />
                                        <Card.Content>
                                            <Paragraph style={{ textAlign: 'center' }}>{item}</Paragraph>
                                        </Card.Content>
                                    </Card>
                                </TouchableOpacity>
                            )
                        }
                    />
                </View>
            </View>
        );
    }
};

export default compose(
    withDevice,
    withAPI
)(Personality);