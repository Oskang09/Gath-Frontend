import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import { TextInput } from 'react-native-paper';
import DTPicker from 'react-native-modal-datetime-picker';

class DateTimePicker extends React.Component {
    state = {
        picker: false
    }

    openPicker = () => {
        this.setState({ picker: true });
    }

    closePicker = () => {
        this.setState({ picker: false });
    }

    confirm = (date) => {
        this.props.dcc(date);
        this.closePicker();
    }

    render() {
        const { props, setting } = this.props;
        const { picker } = this.state;
        return (
            <View>
                <TouchableWithoutFeedback onPress={this.openPicker}>
                    <View>
                        <View pointerEvents="none">
                            <TextInput
                                label={setting.label}
                                value={moment(setting.value).format('YYYY-MM-DD HH:mm')}
                                mode="outlined"
                                {...props}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <DTPicker
                    mode="datetime"
                    isVisible={picker}
                    onConfirm={this.confirm}
                    onCancel={this.closePicker}
                />
            </View>
        );
    }
};

export default DateTimePicker;