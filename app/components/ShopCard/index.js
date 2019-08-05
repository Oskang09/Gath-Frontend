import React from 'react';
import { Text } from 'react-native';
import { Card, TouchableRipple } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';

export class ShopCard extends React.PureComponent {
    static styles = {
        vertical: {
            flex: 1,
            margin: 10,
        },

    }

    getStyles = (type) => {
        switch (type) {
            case 'vertical':
                return {
                    flex: 1,
                    margin: 10,
                };
            case 'horizontal':
                return {
                    margin: 10,
                    width: this.props.device.getX('33')
                };
        }
    }

    render() {
        // TODO: LONG PRESS SHOW SHOP INFO DIALOG
        const { type, onPress, data } = this.props;
        return (
            <TouchableRipple style={this.getStyles(type)} onPress={onPress}>
                <Card>
                    <Card.Cover 
                        style={{ height: this.props.device.getY('20') }}
                        source={{ uri: this.props.api.cdn(`shop-${data.id}.jpg`) }} 
                    />
                    <Card.Title
                        title={data.name}
                        titleStyle={{ fontSize: 15 }}
                        subtitle={data.locate}
                    />
                    <Card.Content style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcon size={20} name="fire" color="orange" />
                        <MaterialIcon size={20} name="fire" color="orange" />
                        <MaterialIcon size={20} name="fire" color="orange" />
                        <MaterialIcon size={20} name="fire" color="orange" />
                        <MaterialIcon size={20} name="fire" />
                        <Text>(26)</Text>
                    </Card.Content>
                </Card>
            </TouchableRipple>
        );
    }
};

export default compose(
    withDevice,
    withAPI
)(ShopCard);