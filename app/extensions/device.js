import React from 'react';
import { Dimensions, PixelRatio } from 'react-native';
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
                    imagePixel: (percent) => {
                        const totalPixel = getXdp(percent) + getYdp(percent);
                        return {
                            width: totalPixel / 2,
                            height: totalPixel / 2
                        };
                    },
                    marginXY: (x, y) => ({
                        marginLeft: x,
                        marginRight: x,
                        marginTop: y,
                        marginBottom: y
                    }),
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