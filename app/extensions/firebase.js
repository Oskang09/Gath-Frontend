import React from 'react';
import { Platform } from 'react-native';
import Firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';

import { injector } from '#utility';

const authenticate = Firebase.auth();
const fcm = Firebase.messaging();
const notify = Firebase.notifications();
let processNotificaiton = null;
const androidChannel = new Firebase.notifications.Android.Channel(
    'local',
    'Local Notification',
    Firebase.notifications.Android.Importance.Max
);
androidChannel.setDescription('Just a description');
notify.android.createChannel(androidChannel);

function buildComponent(
    WrappedComponent,
    decorator = 'firebase',
) {
    return class extends React.Component {
        render() {
            const newProps = Object.assign({
                [decorator]: {
                    initialNotify: async () => {
                        const message = await notify.getInitialNotification();
                        const notificationId = await AsyncStorage.getItem('lastNotification');
                        if (message) {
                            if (message.notification.notificationId === notificationId) {
                                return null;
                            }
                            processNotificaiton(message);
                            await AsyncStorage.setItem('lastNotification', message.notification.notificationId);
                        }
                        return null;
                    },
                    initialize: async (fn, tokenHandler) => {
                        processNotificaiton = fn;
                        if (!await fcm.hasPermission()) {
                            await fcm.requestPermission();
                        }
                        fcm.onTokenRefresh(tokenHandler);
                        tokenHandler(await fcm.getToken());
                        notify.onNotification(
                            async (notification) => {
                                const localNotification = new Firebase.notifications.Notification({ show_in_foreground: true })
                                    .setNotificationId(notification.notificationId)
                                    .setTitle(notification.title)
                                    .setSubtitle(notification.subtitle)
                                    .setBody(notification.body)
                                    .setData(notification.data)
                                    .setSound('default');

                                if (Platform.OS === "android") {
                                    localNotification.android.setChannelId(androidChannel.channelId)
                                        .android.setPriority(Firebase.notifications.Android.Priority.High);
                                }
                                await notify.displayNotification(localNotification);
                            }
                        );

                        notify.onNotificationOpened(
                            (notification) => {
                                // ASYNC: will run through just remove notification
                                processNotificaiton(notification);
                                return notify.removeDeliveredNotification(notification.notification.notificationId)
                            }
                        );
                    },
                    login: (number) => authenticate.signInWithPhoneNumber(number, true),
                    logout: () => authenticate.signOut(),
                    getUser: () => authenticate.currentUser,
                }
            }, this.props);

            return <WrappedComponent {...newProps} />
        }
    };
};

export default injector(buildComponent);