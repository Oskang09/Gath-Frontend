import React from 'react';

import SplashScreen from '#containers/SplashScreen';

import PhoneNumber from '#containers/RegistrationScreen/phone-number';
import UserDetail from '#containers/RegistrationScreen/user-details';
import Introduction from '#containers/RegistrationScreen/introduction';
import Personality from '#containers/RegistrationScreen/personality';
import Badge from '#containers/RegistrationScreen/badge';

import EventScreen from '#containers/HomeScreen/event-screen';
import ProfileScreen from '#containers/HomeScreen/profile-screen';
import ShopScreen from '#containers/HomeScreen/shops-screen';

import CreateEvent from '#containers/CreateEventScreen';
import Notification from '#containers/NotificationScreen';
import Events from '#containers/EventScreen';
import Voucher from '#containers/VoucherScreen';

export default {
    _type: 'switch',
    _setting: {
        initialRouteName: 'splash',
        backBehavior: 'none'
    },
    splash: SplashScreen,
    create_event: CreateEvent,
    events: Events,
    notifications: Notification,
    vouchers: Voucher,
    home: {
        _type: 'material-bottom',
        _setting: {
            initialRouteName: 'shop',
            backBehavior: 'none',
            lazy: true,
            labeled: false,
        },
        shop: ShopScreen,
        event: EventScreen,
        profile: ProfileScreen,
    },
    register: {
        _type: 'switch',
        _setting: {
            initialRouteName: 'phone',
            backBehavior: 'none'
        },
        phone: PhoneNumber,
        detail: UserDetail,
        introduction: Introduction,
        personality: Personality,
        badge: Badge,
    },
};