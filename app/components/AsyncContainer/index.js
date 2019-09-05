import React from 'react';
import { Text } from 'react-native';

export class AsyncContainer extends React.Component {

    state = {
        inital: true,
        data: {},
        error: null,
    }

    componentWillMount() {
        this._mounted = true;
        this.reload(...Object.keys(this.props.promise));
        if (this.props.controller) {
            this.props.controller(this);
        }
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    reload = async (...apis) => {
        if (!this._mounted) {
            return;
        }

        const promise = this.props.promise;
        const data = this.state.data;
        for (const api of apis) {
            data[api] = await promise[api]();
        }
        this.setState({ inital: false, data });
    }

    render() {
        const { inital, error, data } = this.state;
        if (inital) {
            return <Text>Loading</Text>;
        }

        if (error) {
            return <Text>Error {error.toString()}</Text>;
        }
        return this.props.children(data);
    }
};

export default AsyncContainer;