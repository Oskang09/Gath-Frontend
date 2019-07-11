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
                { props.children }
            </Async.Fulfilled>
        </Async>
    )
};

export default AsyncContainer;