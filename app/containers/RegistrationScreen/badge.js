import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';

export class Badge extends React.PureComponent {
    state = {
        data: [],
    }

    toggle = (index) => {
        const { data } = this.state;
        if (data.includes(index)) {
            data.splice(data.indexOf(index), 1);
        } else {
            data.push(index);
        }
        this.setState({ data });
    }

    updateBadge = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true, error: null });
        try {
            const { api, navigation } = this.props;
            const response = await api.request(
                'POST', 
                `/users/profile`,
                { badge: this.state.data }
            );
            if (response.ok) {
                navigation.navigate('home');
            } else {
                this.setState({ loading: false, error: response.message });
            }
        } catch (error) {
            this.setState({ loading: false, error });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={this.updateBadge}>
                    <View style={{
                        alignItems: 'flex-end',
                        padding: 10
                    }}>
                        <Text>Next Step</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ 
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    margin: 20,
                }}>
                    <TouchableOpacity onPress={() => {}}>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('#assets/icon.jpg')} style={{ width: 50, height: 50 }} />
                            <Text>Comment</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}}>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('#assets/icon.jpg')} style={{ width: 50, height: 50 }} />
                            <Text>Comment</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}}>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('#assets/icon.jpg')} style={{ width: 50, height: 50 }} />
                            <Text>Comment</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};

export default compose(
    withDevice,
    withAPI
)(Badge);