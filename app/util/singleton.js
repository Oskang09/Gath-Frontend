import Feather, { FeatherSocket } from 'feathersjs-sdk';
import { AsyncStorage } from 'react-native';

export const feathers = new Feather({
    transport: {
        default: new FeatherSocket({
            storage: AsyncStorage,
            use: 'websocket',
            host: 'http://192.168.56.1:3000',
            connect: () => {

            },
            disconnect: () => {

            },
        })
    }
});

export default {
    feathers
};