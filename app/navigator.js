import RouterSetting from './routes';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

export default createAppContainer(
    createSwitchNavigator(RouterSetting, {
        initialRouteName: 'splash'
    })
);