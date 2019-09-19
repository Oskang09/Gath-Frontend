import React from 'react';
import { View } from 'react-native';
import { Card, TouchableRipple, Paragraph, List } from 'react-native-paper';

import Image from '#components/Image';
import moment from 'moment';
import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';

export class EventCard extends React.PureComponent {

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
                    width: this.props.device.getX(45)
                };
        }
    }

    render() {
        const { type, onPress, data } = this.props;
        return (
            <TouchableRipple style={this.getStyles(type)} onPress={() => onPress(data)}>
                <Card>
                    <Image
                        component={Card.Cover}
                        source={this.props.api.cdn(`event-${data.id}`)}
                    />
                    <List.Item
                        title={data.name}
                        titleStyle={{ fontSize: 16 }}
                        description={
                            (props) => {
                                return (
                                    <View>
                                        <Paragraph style={{ color: props.color, fontSize: 12 }}>{moment(data.start_time).format('ddd, HH:mm')}</Paragraph>
                                        <Paragraph style={{ color: props.color, fontSize: 12 }}>{data.location}</Paragraph>
                                    </View>
                                );
                            }
                        }
                    />
                </Card>
            </TouchableRipple>
        );
    }
};

export default compose(
    withDevice,
    withAPI
)(EventCard);