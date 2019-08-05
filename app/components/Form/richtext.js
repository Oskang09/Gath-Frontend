import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

function RichText({
    dcc,
    props,
    setting: { label, value}
}) {
    return (
        <View style={{ flexDirection: 'row' }}>
            <TextInput
                label={label}
                value={value}
                onChangeText={dcc}
                multiline={true}
                {...props}
            />
        </View>
    );
}

export default RichText;