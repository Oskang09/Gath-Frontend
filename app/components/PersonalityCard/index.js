import React from 'react';

import { TouchableOpacity } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';

import Icon from '#components/Icon';
import { compose } from '#utility';
import withDevice from '#extension/device';

export class PersonalityCard extends React.PureComponent {
    renderCard = () => {
        const { data, active, name } = this.props;
        return (
            <Card
                width={this.props.device.getX(25)}
                style={{ margin: this.props.device.getX(2) }}
            >
                <Card.Content style={{ alignItems: 'center' }}>
                    {
                        active && (
                            <Icon
                                style={{ position: 'absolute', top: 5, right: 5 }}
                                package="antdesign" color={this.props.device.primaryColor}
                                name="checkcircle"
                                size={15}
                            />
                        )
                    }
                    <Icon size={33} package={data.package} name={data.icon} />
                    <Paragraph style={{ fontSize: 10 }}>{name}</Paragraph>
                </Card.Content>
            </Card>
        );
    }

    render() {
        const { onPress } = this.props;
        if (!onPress) {
            return this.renderCard();
        }
        return (
            <TouchableOpacity activeOpacity={1} onPress={onPress}>
                { this.renderCard() }
            </TouchableOpacity>
        );
    }
};

export default compose(withDevice)(PersonalityCard);