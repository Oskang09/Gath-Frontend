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
                    switchTo: (to) => {
                        appStack = [];
                        this.props.navigation.navigate(to);
                    },
                    replace: (to) => {
                        this.props.navigation.navigate(to);
                    },
                    pushMultiple: (...multiple) => {
                        const last = multiple.pop();
                        for (const multi of multiple) {
                            if (typeof multi === 'object') {
                                appStack.push({
                                    page: multi.routeName,
                                    stack: multi.params
                                });
                            } else {
                                appStack.push({
                                    page: multi
                                });
                            }
                        }
                        this.props.navigation.navigate(last);
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