import React from 'react';

import antdesign from 'react-native-vector-icons/AntDesign';
import entypo from 'react-native-vector-icons/Entypo';
import evilicons from 'react-native-vector-icons/EvilIcons';
import feather from 'react-native-vector-icons/Feather';
import fontawesome from 'react-native-vector-icons/FontAwesome';
import fontawesome5 from 'react-native-vector-icons/FontAwesome5';
import fontawesome5pro from 'react-native-vector-icons/FontAwesome5Pro';
import foundation from 'react-native-vector-icons/Foundation';
import ionicons from 'react-native-vector-icons/Ionicons';
import materialcommunityicons from 'react-native-vector-icons/MaterialCommunityIcons';
import materialicons from 'react-native-vector-icons/MaterialIcons';
import octicons from 'react-native-vector-icons/Octicons';
import simplelineicons from 'react-native-vector-icons/SimpleLineIcons';
import zocial from 'react-native-vector-icons/Zocial';

const ICON_MAP_SET = {
    antdesign, entypo, evilicons, feather, fontawesome,
    fontawesome5, fontawesome5pro, foundation, ionicons,
    materialcommunityicons, materialicons, octicons, zocial,
    simplelineicons
};

/*
    Example Usage:

    - <Icon package='fontawesome5' name="" /> 
*/
function Icon(props) {
    const Component = ICON_MAP_SET[props.package.toLowerCase()];
    return <Component {...props} />;
};

export default Icon;