import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

import Appbar from '#components/Appbar';
import PureList from '#components/PureList';
import PersonalityCard from '#components/PersonalityCard';

import { compose } from '#utility';
import withDialog from '#extension/dialog';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';

export class Personality extends React.PureComponent {
    state = {
        data: [],
        loading: false,
    }
    listController = null

    toggle = (item) => {
        const { data } = this.state;
        if (data.includes(item)) {
            data.splice(data.indexOf(item), 1);
        } else {
            if (data.length >= 5) {
                return this.props.showDialog('Only can choose five.');
            }
            data.push(item);
        }
        this.setState({ data }, () => this.listController && this.listController.refresh());
    }

    updatePersonality = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });
        try {
            const { api, navigation } = this.props;
            await api.request(
                'POST', 
                `/users/profile`,
                { personality: this.state.data }
            );
            navigation.navigate('introduction');
        } catch (error) {
            this.setState({ loading: false }, () => this.props.showDialog(error.message));
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
                        controller={(ctl) => this.listController = ctl}
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
    withDialog
)(Personality);