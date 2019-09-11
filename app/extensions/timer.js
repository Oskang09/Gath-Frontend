import React from 'react';
import { injector } from '#utility';

function buildComponent(
    WrappedComponent,
) {
    return class extends React.Component {
        timeouts = {}
        interval = {}

        render() {
            const newProps = Object.assign({
                addTimer: (type, key, cb, timeInSeconds) => {
                    if (type === 'TIMEOUT') {
                        this.timeouts[key] = setTimeout(cb, timeInSeconds * 1000);
                    }

                    if (type === 'INTERVAL') {
                        this.interval[key] = setInterval(cb, timeInSeconds * 1000);
                    }
                },
                removeTimer: (key) => {
                    if (this.interval[key]) {
                        clearInterval(this.interval[key]);
                        delete this.interval[key];
                    }

                    if (this.timeouts[key]) {
                        clearTimeout(this.timeouts[key]);
                        delete this.timeouts[key];
                    }
                }
            }, this.props)
            return <WrappedComponent {...newProps} />;
        }
    };
};

export default injector(buildComponent);