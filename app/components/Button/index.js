import React from 'react';

import { Text } from 'react-native';
import { Button } from 'react-native-paper';

import { compose } from '#utility';
import withDevice from '#extension/device';

export class StyledButton extends React.PureComponent {
    render() {
        const {
            text,
            onPress,
            color = this.props.device.primaryColor,
            roundness = 0,
            mode = "contained",
            width = this.props.device.getX(20),
            height = this.props.device.getY(7.5),
            textStyle = { color: '#ffffff' },
            loading = false,
            style,
        } = this.props;
        return (
            <Button
                compact={true}
                mode={mode}
                loading={loading}
                onPress={onPress}
                theme={{
                    colors: {
                        primary: color,
                    },
                    roundness, 
                }}
                style={{
                    width, height,
                    justifyContent: 'center',
                    ...style
                }}
            >
                { typeof text === 'string' ? <Text style={textStyle}>{text}</Text> : text }
            </Button>
        );
    }
};

export default compose(withDevice)(StyledButton);