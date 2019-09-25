import React from 'react';
import { create } from 'apisauce';
import { injector } from '#utility';

const requester = create({ baseURL: 'http://192.168.56.1:3000' });
// const requester = create({ baseURL: 'https://gathfyp2019.herokuapp.com' });
const request = async (method, path, body) => {
    const response = await requester[method.toLowerCase()](path, body);
    if (response.data) {
        if (!response.data.ok) {
            throw Error(response.data.message);
        }
        if (response.data._meta) {
            return response.data;
        }
        return response.data.result;
    } else {
        return { message: response.problem };
    }
};

const config = {};
function buildComponent(
    WrappedComponent, 
    decorator = 'api',
) {
    return class extends React.Component {
        componentWillMount() {
            this._isMounted = true;
        }
        
        componentWillUnmount() {
            this._isMounted = false;
        }

        render() {
            const newProps = Object.assign({
                [decorator]: {
                    request,
                    build: (method, path, body) => async () => request(method, path, body),
                    loadConfig: async () => {
                        const { data } = await requester.get(`/config`);
                        if (data) {
                            Object.assign(config, data.result);
                        }
                    },
                    getConfig: () => config,
                    setToken: (token) => {
                        requester.setHeader('gath-token', token);
                    },
                    cdn: (path) => `https://firebasestorage.googleapis.com/v0/b/gathfyp2019.appspot.com/o/${path}?alt=media}`,
                    staticResource: (path) => `${requester.getBaseURL()}${path}`,
                }
            }, this.props);

            return <WrappedComponent {...newProps} />;
        }
    };
};

export default injector(buildComponent);