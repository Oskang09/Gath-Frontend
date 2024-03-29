import React from 'react';
import { View, Text } from 'react-native';
import { Chip } from 'react-native-paper';

import Icon from '#components/Icon';
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
                if (this.props.onFilterChange) {
                    this.props.onFilterChange(data.length === 1 ? data[0] : data);
                }
            }
        );
    }

    render() {
        const { data } = this.state;
        const { title, device, items } = this.props;
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Text style={{ marginLeft: 10, marginRight: 10 }}>{title}</Text>
                <PureList
                    type="horizontal"
                    controller={(ctl) => this.filterController = ctl}
                    containerStyle={{ flex: 1 }}
                    data={items}
                    render={
                        ({ item }) => {
                            const { display, value, icon } = item;
                            const iconComponent = icon ? (
                                typeof icon === 'string' ?
                                    icon : 
                                    (props) => <Icon {...props} {...icon} /> 
                            ) : null;
                            return (
                                <Chip
                                    icon={iconComponent}
                                    mode="outlined"
                                    style={{
                                        margin: 2,
                                        backgroundColor: data.includes(value) ?
                                            device.primaryColor :
                                            'white'
                                    }}
                                    theme={{
                                        colors: {
                                            text: data.includes(value) ?
                                                'white' :
                                                'black'
                                        }
                                    }}
                                    onPress={() => this.toggle(value)}
                                >
                                    { display }
                                </Chip>
                            );
                        }
                    }
                />
            </View>
        );
    }
};

export default compose(withDevice)(FilterBar);