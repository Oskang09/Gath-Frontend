import React from 'react';
import { injector } from '#utility';

let appStack = [];
function buildComponent(
    WrappedComponent
) {
    return class extends React.PureComponent {
        render() {
            const newProps = Object.assign({
                navigator: {
                    getState: () => this.props.navigation.state.params,
                    switchTo: (to) => {
                        appStack = [];
                        this.props.navigation.navigate(to);
                    },
                    replace: (to) => {
                        this.props.navigation.navigate(to);
                    },
                    push: (to) => {
                        appStack.push({
                            page: this.props.navigation.state.routeName,
                            state: this.props.navigation.state.params,
                        });
                        this.props.navigation.navigate(to);
                    },
                    back: () => {
                        const stack = appStack.pop();
                        this.props.navigation.navigate({
                            routeName: stack.page,
                            params: stack.state
                        });
                    }
                }
            }, this.props);
            
            return <WrappedComponent {...newProps} />
        }
    }
};

module.exports = injector(buildComponent);