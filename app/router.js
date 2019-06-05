import RouterSetting from './config/routes';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { objectLoop } from '#utility';

const isRoute = (route) => typeof route._type === 'string' && typeof route._setting === 'object';
const buildRouter = (route) => {
    if (isRoute(route)) {
        const routes = {};
        const type = route._type;
        const setting = route._setting;
        objectLoop(route, (key, value) => routes[key] = buildRouter(value), [ '_type', '_setting' ]);
    
        if (type === 'material-bottom') {
            return createMaterialBottomTabNavigator(routes, setting);
        } else if (type === 'switch') {
            return createSwitchNavigator(routes, setting)
        }
    }
    return route;
};

export default createAppContainer(buildRouter(RouterSetting));