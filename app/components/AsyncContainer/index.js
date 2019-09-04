import React from 'react';
import { Text } from 'react-native';

export class AsyncContainer extends React.Component {

    state = {
        inital: true,
        data: null,
        error: null,
    }

    async componentWillMount() {
        this._mounted = true;

        if (this.props.controller) {
            this.props.controller(this);
        }

        const promise = this.props.promise;
        const data = {};

        try {
            for (const key of Object.keys(promise)) {
                if (!this._mounted) {
                    return;
                }
                data[key] = await promise[key];
            }
            this.setState({ inital: false, data });
        } catch (error) {
            this.setState({ inital: false, error });
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
            data[api] = await promise[api];
        }
        this.setState({ data });
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