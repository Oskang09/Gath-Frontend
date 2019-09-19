import React from 'react';
import { Card, TouchableRipple, Paragraph, List } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from '#components/Icon';
import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';

export class ShopCard extends React.PureComponent {
    getStyles = (type) => {
        switch (type) {
            case 'vertical':
                return {
                    flex: 1,
                    margin: 10,
                };
            case 'horizontal':
                return {
                    flex: 1,
                    margin: 10,
                    width: this.props.device.getX('33')
                };
        }
    }

    render() {
        const { type, onPress, data } = this.props;
        return (
            <TouchableRipple style={this.getStyles(type)} onPress={onPress}>
                <Card>
                    <Card.Cover 
                        style={{ height: this.props.device.getY('20') }}
                        source={{ uri: this.props.api.cdn(`shop-${data.id}`) }} 
                    />
                    <Card.Title
                        title={data.name}
                        titleStyle={{ fontSize: 16 }}
                        subtitle={data.locate}
                        subtitleStyle={{ fontSize: 12 }}
                    />
                    <Card.Content style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcon size={16} name="fire" color="orange" />
                        <MaterialIcon size={16} name="fire" color="orange" />
                        <MaterialIcon size={16} name="fire" color="orange" />
                        <MaterialIcon size={16} name="fire" color="orange" />
                        <MaterialIcon size={16} name="fire" />
                        <Paragraph style={{ fontSize: 12, marginLeft: 2 }}>(26)</Paragraph>
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