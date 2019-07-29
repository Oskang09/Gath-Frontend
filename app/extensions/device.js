import React from 'react';
import { Dimensions, PixelRatio } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { injector } from '#utility';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const getXdp = (percent) => PixelRatio.roundToNearestPixel((screenWidth * parseFloat(percent)) / 100);
const getYdp = (percent) => PixelRatio.roundToNearestPixel((screenHeight * parseFloat(percent)) / 100);

function buildComponent(
    WrappedComponent, 
    decorator = 'device'
) {
    return class extends React.Component {
        render() {
            const newProps = Object.assign({
                [decorator]: {
                    getX: getXdp,
                    getY: getYdp,
                    primaryColor: '#87EFD7',
                }
            }, this.props);
            
            return (
                <WrappedComponent
                    {...newProps}
                />
            );
        }
    };
};

export default injector(buildComponent);