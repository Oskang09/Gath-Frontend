import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Card, Paragraph, Button } from 'react-native-paper';

import Appbar from '#components/Appbar';
import Icon from '#components/Icon';
import PureList from '#components/PureList';
import PersonalityCard from '#components/PersonalityCard';

import { compose } from '#utility';
import withError from '#extension/error';
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
                this.setState({ loading: false }, () => this.props.showError(response.message));
            }
        } catch (error) {
            this.setState({ loading: false }, () => this.props.showError(error));
        }
    }

    render() {
        const { data } = this.state;
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Appbar />
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
                        ref={(ctl) => this.listController = ctl}
                        data={Object.keys(this.props.api.getConfig().personality)}
                        numColumns={3}
                        render={
                            ({ item }) => (
                                <PersonalityCard active={data.includes(item)} onPress={() => this.toggle(item)} name={item} data={this.props.api.getConfig().personality[item]} />
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
    withAPI,
    withError
)(Personality);