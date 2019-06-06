import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Feather, { FeatherSocket } from 'feathersjs-sdk';
import { injector } from '#utility';

const socket = new FeatherSocket({
    storage: AsyncStorage,
    use: 'websocket',
    host: 'http://192.168.56.1:3000'
});
const feather = new Feather({ transport: { default: socket }});

function buildComponent(
    WrappedComponent, 
    decorator = 'socket', 
    connect = 'connect', 
    disconnect = 'disconnect',
    user = 'featherUser',
) {
    return class extends React.Component {
        render() {
            const newProps = Object.assign({
                [decorator]: feather,
                [user]: feather.getUser(),
                [connect]: (cb) => socket.on('connect', cb),
                [disconnect]: (cb) => socket.on('disconnect', cb),
            }, this.props);

            return (
                <WrappedComponent
                    {...newProps}
                />
            );
        }
    };
};

export default injector(buildComponent);