import React from 'react';
import { Text } from 'react-native';
import Async from 'react-async';

export class AsyncContainer extends React.PureComponent {
    render() {
        return (
            <Async promise={this.props.promise}>
                <Async.Pending>
                    <Text>Loading</Text>
                </Async.Pending>
                <Async.Fulfilled>
                    { this.props.children }
                </Async.Fulfilled>
                <Async.Rejected>
                    <Text>Error</Text>
                </Async.Rejected>
            </Async>
        );
    }
};

export default AsyncContainer;