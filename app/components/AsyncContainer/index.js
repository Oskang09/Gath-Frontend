import React from 'react';
import Async from 'react-async';
import { Text } from 'react-native';


function AsyncContainer(props) {
    return (
        <Async {...props}>
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
    )
};

export default AsyncContainer;