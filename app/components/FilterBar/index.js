import React from 'react';
import { View, Text } from 'react-native';
import { Chip } from 'react-native-paper';
import PureList from '#components/PureList';

import { compose } from '#utility';
import withDevice from '#extension/device';

export class FilterBar extends React.Component {
    state = {
        data: [],
    }
    filterController = null

    componentDidMount() {
        if (this.props.ref) {
            this.props.ref(this);
        }
    }

    toggle = (item) => {
        const { data } = this.state;
        if (data.includes(item)) {
            data.splice(data.indexOf(item), 1);
        } else {
            data.push(item);
        }
        this.setState(
            { data },
            () => {
                this.filterController.refresh();
                if (this.props.onFilterChange) {
                    this.props.onFilterChange();
                }
            }
        );
    }

    render() {
        const { data } = this.state;
        const { title, device, items } = this.props;
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                <Text style={{ marginLeft: 10, marginRight: 10 }}>{title}</Text>
                <PureList
                    type="horizontal"
                    ref={(ctl) => this.filterController = ctl}
                    containerStyle={{ flex: 1 }}
                    data={items}
                    render={
                        ({ item }) => (
                            <Chip
                                mode="outlined"
                                style={{
                                    margin: 2,
                                    backgroundColor: data.includes(item) ?
                                        device.primaryColor :
                                        'white'
                                }}
                                theme={{
                                    colors: {
                                        text: data.includes(item) ?
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
        );
    }
};

export default compose(withDevice)(FilterBar);