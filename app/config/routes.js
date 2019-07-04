import SplashScreen from '#containers/SplashScreen';
import HomeScreen from '#containers/HomeScreen';
import PhoneNumber from '#containers/RegistrationScreen/phone-number';
import UserDetail from '#containers/RegistrationScreen/user-details';

export default {
    _type: 'switch',
    _setting: {
        initialRouteName: 'splash',
    },
    splash: SplashScreen,
    home: HomeScreen,
    register: {
        _type: 'switch',
        _setting: {
            initialRouteName: 'phone',
        },
        phone: PhoneNumber,
        detail: UserDetail,
    },
}