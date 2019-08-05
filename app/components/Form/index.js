import React from 'react';
import { View } from 'react-native';

import Input from './input';
import Image from './image';
import RichText from './richtext';
import MaterialPicker from './picker';
import DateTimePicker from './datetime';

const filterComponent = ({ type, key, dcc, props, setting }) => {
    const componentProps = { key, dcc, setting, props };
    if (type === 'picker') {
        return <MaterialPicker {...componentProps} />;
    } else if (type === 'input') {
        return <Input {...componentProps} />
    } else if (type === 'image') {
        return <Image {...componentProps} />
    } else if (type === 'richtext') {
        return <RichText {...componentProps} />
    } else if (type === 'datetime') {
        return <DateTimePicker {...componentProps} />
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
                    (form, index) => (
                        <View key={`row-${index}`} style={rowStyle}>
                            {form}
                        </View>
                    )
                )
            }
        </View>
    );
};

export default Form;