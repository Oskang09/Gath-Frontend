import React from 'react';
import { Animated, View, Text } from 'react-native';

export class Loading extends React.PureComponent {

    rotation = new Animated.Value(0)

    componentWillMount() {
        this.animateImage();
    }
    
    animateImage = () => Animated.loop(
        Animated.timing(
            this.rotation, {
                toValue: 1,
                duration: 1500,
            }
        ),
        { iterations: -1 }
    ).start()

    render() {
        const rotate = this.rotation.interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [ '0deg', '360deg' ]
        });
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Animated.Image
                    style={{
                        width: 64,
                        height: 64,
                        transform: [{ rotate }]
                    }}
                    source={require('#assets/loading.png')}
                />
                {
                    this.props.content && (
                        <Text style={{ fontSize: 16, ...this.props.textStyle }}>{this.props.content}</Text>
                    )
                }
            </View>
        );
    }
}

export default Loading;