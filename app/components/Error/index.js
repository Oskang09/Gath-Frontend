import React from 'react';
import { View, Image, Text } from 'react-native';

function Error(props) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Image
                style={{
                    width: 128,
                    height: 128,
                }}
                source={require('#assets/fail.png')}
            />
            {
                props.content && (
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Sorry, error occurs</Text>
                )
            }
        </View>
    );
}

export default Error;