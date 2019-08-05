import React from 'react';
import { View, Picker } from 'react-native';
import { Colors } from 'react-native-paper';

class MaterialPicker extends React.PureComponent {
    state = {
        picker: false
    }

    openPicker = () => {
        this.setState({ picker: true });
    }

    closePicker = () => {
        this.setState({ picker: false });
    }

    choose = (value) => {
        this.props.dcc(value);
        this.closePicker();
    }

    render() {
        const { value, items, key } = this.props.setting;
        return (
            <View key={key} style={{
                borderRadius: 17,
                borderWidth: 1,
                borderColor: Colors.grey600,
                marginTop: 5,
                ...this.props.props.style
            }}>
                <Picker
                    style={{ marginTop: 2, marginLeft: 5 }}
                    selectedValue={value}
                    onValueChange={this.choose}
                >
                    {
                        items.map(
                            (item) => <Picker.Item key={item} label={item} value={item} />
                        )
                    }
                </Picker>
            </View>
        );
    }
};

export default MaterialPicker;