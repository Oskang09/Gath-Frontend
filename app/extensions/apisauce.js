import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { create } from 'apisauce';
import { injector } from '#utility';

const requester = create({ baseURL: 'http://192.168.56.1:3001/' });
const config = {};
function buildComponent(
    WrappedComponent, 
    decorator = 'api',
) {
    return class extends React.Component {
        render() {
            const newProps = Object.assign({
                [decorator]: {
                    request: async (method, path, body) => {
                        const response = await requester[method.toLowerCase()](path, body)
                        if (response.data) {
                            return response.data;
                        } else {
                            return { message: response.problem };
                        }
                    },
                    getLocalConfig: () => config,
                    getServerConfig: async () => {
                        const localConfig = JSON.parse(await AsyncStorage.getItem('serverConfig'));
                        const { data } = await requester.get(`/config/${localConfig ? localConfig.version.config : 0}`);
                        if (data.result) {
                            await AsyncStorage.setItem('serverConfig', JSON.stringify(data.result));
                            Object.assign(config, data.result);
                        } else {
                            Object.assign(config, localConfig);
                        }
                    },
                    setToken: (token) => {
                        requester.setHeader('gath-token', token)
                    }
                }
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