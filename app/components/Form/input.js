import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

function Input({
    dcc,
    props,
    setting: { noWhitespace, label, value }
}) {
    return (
        <View>
            <TextInput
                label={label}
                value={value}
                onChangeText={
                    (value) => {
                        if (noWhitespace) {
                            value = value.replace(' ', '');
                        };
                        return dcc(value);
                    }
                }
                {...props}
            />
        </View>
    );
};

export default Input;