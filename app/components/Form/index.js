import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { View, Picker, TouchableOpacity } from 'react-native';
import { TextInput, Avatar, Colors } from 'react-native-paper';

const filterComponent = ({ type, dcc, style, setting }) => {
    if (type === 'picker') {
        return <MaterialPicker dcc={dcc} setting={setting} style={style} />;
    } else if (type === 'input') {
        return Input(dcc, style, setting);
    } else if (type === 'image') {
        return Image(dcc, setting);
    } else if (type === 'richtext') {
        return RichText(dcc, style, setting);
    }
};

function Form({ containerStyle, formSetting, rowStyle }) {
    let forms = [];

    formSetting.forEach(
        (props) => {
            if (!forms[props.row]) {
                forms[props.row] = [];
            }

            forms[props.row].push(filterComponent(props));
        }
    );
    return (
        <View style={containerStyle}>
            {
                forms.map(
                    (form) => (
                        <View style={rowStyle}>
                            {form}
                        </View>
                    )
                )
            }
        </View>
    );
};

export class MaterialPicker extends React.PureComponent {
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
        const { value, items } = this.props.setting;
        return (
            <View style={{
                borderRadius: 17,
                borderWidth: 1,
                borderColor: Colors.grey600,
                marginTop: 5,
                ...this.props.style
            }}>
                <Picker
                    style={{ marginTop: 2, marginLeft: 5 }}
                    selectedValue={value}
                    onValueChange={() => {}}
                >
                    {
                        items.map(
                            (item) => <Picker.Item label={item} value={item} />
                        )
                    }
                </Picker>
            </View>
        );
    }
};

function Image(dcc, { value }) {
    return (
        <View>
            <TouchableOpacity onPress={
                async () => {
                    try {
                        const image = await ImagePicker.openPicker({
                            cropping: true,
                            includeBase64: true,
                            width: 300,
                            height: 300,
                            mediaType: 'photo'
                        });
                        dcc('data:' + image.mime + ';base64,' + image.data);
                    } catch (error) {
                        dcc(null);
                    }
                    await ImagePicker.clean();
                }
            }>
                <Avatar.Image
                    source={value ? { uri: value } : require('#assets/icon.jpg')}
                    size={128}
                /> 
            </TouchableOpacity>
        </View>
    );
}

function RichText(dcc, props, { key, value }) {
    return (
        <View style={{ flexDirection: 'row' }}>
            <TextInput
                label={key}
                value={value}
                onChangeText={dcc}
                multiline={true}
                {...props}
            />
        </View>
    );
}

function Input(dcc, props, { key, value, prefix }) {
    return (
        <View>
            <TextInput
                label={key}
                value={prefix + value}
                onChangeText={
                    prefix ? 
                        (value) => {
                            if (value.length < prefix.length) {
                                dcc(prefix);
                            } else {
                                dcc(value);
                            }
                        } :
                        dcc
                }
                {...props}
            />
        </View>
    );
}

export default Form;