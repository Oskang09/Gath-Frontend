import SplashScreen from 'containers/SplashScreen';
import HomeScreen from 'containers/HomeScreen';
import LoginScreen from 'containers/LoginScreen';

export default {
    _type: 'switch',
    _setting: {
        initialRouteName: 'splash',
    },
    splash: SplashScreen,
    login: LoginScreen,
    main: {
        _type: 'material-bottom',
        _setting: {
            initialRouteName: 'home',
        },
        home: HomeScreen
    },
}