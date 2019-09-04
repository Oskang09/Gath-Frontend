import React from 'react';

import SplashScreen from '#containers/SplashScreen';

import PhoneNumber from '#containers/RegistrationScreen/phone-number';
import UserDetail from '#containers/RegistrationScreen/user-details';
import Introduction from '#containers/RegistrationScreen/introduction';
import Personality from '#containers/RegistrationScreen/personality';

import EventScreen from '#containers/HomeScreen/event-screen';
import ProfileScreen from '#containers/HomeScreen/profile-screen';
import PostScreen from '#containers/HomeScreen/posts-screen';

import PostDetail from '#containers/PostDetailScreen';
import CreateEvent from '#containers/CreateEventScreen';
import EventDetail from '#containers/EventDetailScreen';

import Notification from '#containers/NotificationScreen';
import Voucher from '#containers/VoucherScreen';

import Icon from '#components/Icon';

export default {
    _type: 'switch',
    _setting: {
        initialRouteName: 'splash',
        backBehavior: 'none'
    },
    splash: SplashScreen,

    event_detail: EventDetail,
    post_detail: PostDetail,
    create_event: CreateEvent,
    
    notifications: Notification,
    vouchers: Voucher,

    home: {
        _type: 'material-bottom',
        _setting: {
            initialRouteName: 'event_list',
            backBehavior: 'none',
            lazy: true,
            labeled: false,
            defaultNavigationOptions: ({ navigation }) => ({
                tabBarIcon: () => {
                    const { routeName } = navigation.state;
                    if (routeName === 'event_list') {
                        return <Icon package="materialicons" name="library-books" size={25} />;
                    }
                    if (routeName === 'profile') {
                        return <Icon package="materialcommunityicons" name="face-profile" size={25} />;
                    }

                    if (routeName === 'post_list') {
                        return <Icon package="entypo" name="newsletter" size={25} />;
                    }
                }
            })
        },
        post_list: PostScreen,
        event_list: EventScreen,
        profile: ProfileScreen,
    },
    register: {
        _type: 'switch',
        _setting: {
            initialRouteName: 'phone',
        },
        phone: PhoneNumber,
        detail: UserDetail,
        introduction: Introduction,
        personality: Personality,
    },
};