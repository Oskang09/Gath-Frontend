import React from 'react';
import { Text } from 'react-native';
import Error from '#components/Error';
import Loading from '#components/Loading';

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

        try {
            for (const api of apis.length === 0 ? Object.keys(promise) : apis) {
                data[api] = await promise[api]();
            }
        } catch (error) {
            return this.setState({ inital: false, error, data: null })
        }
        this.setState({ inital: false, data, error: null });
    }

    render() {
        const { inital, error, data } = this.state;
        if (inital) {
            if (this.props.loading) {
                return this.props.loading();
            }
            return <Loading />;
        }

        if (error) {
            if (this.props.error) {
                return this.props.error(error);
            }
            return <Error content={error.toString()} />;
        }
        return this.props.children(data);
    }
};

export default AsyncContainer;