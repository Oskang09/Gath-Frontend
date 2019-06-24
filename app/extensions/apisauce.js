import React from 'react';
import { create } from 'apisauce';
import { injector } from '#utility';

const requester = create({ baseURL: '192.168.56.1' });

function buildComponent(
    WrappedComponent, 
    decorator = 'api',
) {
    return class extends React.Component {
        render() {
            const newProps = Object.assign({
                [decorator]: {
                    request: (method, path, body) => requester[method](path, body),
                    addHeader: (key, value) => {
                        requester.setHeader(key, value)
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