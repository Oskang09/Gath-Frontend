import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

function Image({
    dcc,
    setting: { value, displayComponent }
}) {
    return (
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
                    await ImagePicker.clean();
                    dcc('data:' + image.mime + ';base64,' + image.data);
                } catch (error) {
                    dcc(null);
                }
            }
        }>
            {
                displayComponent ? 
                    displayComponent(value && { uri: value }) :
                    <Avatar.Image
                        source={value && { uri: value }}
                        size={128}
                    /> 
            }
        </TouchableOpacity>
    );
}

export default Image;