import React from 'react';
import { create } from 'apisauce';
import { injector } from '#utility';

const requester = create({ baseURL: 'http://192.168.56.1:3000/' });

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
                            if (response.data.ok) {
                                return response.data.result;
                            } else {
                                return response.data.error;
                            }
                        } else {
                            return response.problem;
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