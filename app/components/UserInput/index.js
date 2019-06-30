import React from 'react';
import { View, Text, TextInput, Picker } from 'react-native';

export class UserInput extends React.PureComponent {

    renderPicker(dcc, { key, value, selectable, pickerStyle }) {
        return (
            <View style={{
                flexDirection: 'row',
            }}>
                <View style={{ alignSelf: 'center', marginRight: 20 }}>
                    <Text>{key}</Text>
                </View>
                <Picker
                    style={ pickerStyle || { width: 150 } }
                    selectedValue={value}
                    onValueChange={dcc}
                >
                    {
                        selectable.map(({ label, value }) => <Picker.Item label={label} value={value} />)
                    }
                </Picker>
            </View>
        )
    }

    renderInput(dcc, { key, value }) {
        return (
            <View style={{
                flexDirection: 'row',
            }}>
                <View style={{ alignSelf: 'center', marginRight: 20 }}>
                    <Text>{key}</Text>
                </View>
                <TextInput
                    value={value}
                    onChangeText={dcc}
                />
            </View>
        );
    }

    render() {
        const { type, setting, dcc, containerStyle } = this.props;
        let Component;
        if (type === 'input') {
            Component = this.renderInput(dcc, setting);
        } else if (type === 'picker') {
            Component = this.renderPicker(dcc, setting);
        }
        return (
            <View style={containerStyle}>{ Component }</View>
        );
    }
};

export default UserInput;