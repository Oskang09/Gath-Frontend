import React from 'react';
import { FlatList } from 'react-native';
import { CancelToken } from 'apisauce';

import Loading from '#components/Loading';
import FilterBar from '#components/FilterBar';
import withAPI from '#extension/apisauce';
import { compose } from '#utility';


export class QueryableList extends React.PureComponent {
    state = {
        data: [],
        refreshing: true,
        resetWhenRefresh: false,
        query: null,
        configureProps: null,
        error: null,
        cancelToken: null,
    }
    _isMounted = false

    setState = (...args) => {
        if (!this._isMounted) {
            return;
        }
        return super.setState(...args);
    }

    refreshData = async (refreshType = 'default') => {
        if (!this._isMounted) {
            return;
        }

        if (this.state.refreshing && this.state.cancelToken) {
            this.state.cancelToken.cancel();
        }

        const cancelToken = CancelToken.source();
        this.setState({ refreshing: true, cancelToken });
        const { _meta, ok, result, error } = await this.props.api.request(
            'GET',
            this.props.uri(this.state.query),
            {},
            cancelToken.token
        );

        if (result && ok) {
            if (refreshType.includes(this.state.resetWhenRefresh)) {
                this.state.data = result;
            } else {
                this.state.data.push(...result);
            }

            if (_meta && this.props.type === 'vertical') {
                const isEnd = _meta.currentPage >= _meta.pageCount;
                this.setState({
                    data: this.state.data,
                    refreshing: false,
                    cancelToken: null,
                    configureProps: {
                        ...this.state.configureProps,
                        onEndReached: isEnd ? undefined : this.updateQuery({ page: _meta.currentPage + 1 }, 'paginate'),
                        onEndReachedThreshold: isEnd ? undefined : 0.7,
                    }
                });
            } else {
                this.setState({
                    data: this.state.data,
                    cancelToken: null,
                    refreshing: false,
                });
            }
        } else {
            this.setState({
                data: this.state.data,
                cancelToken: null,
                refreshing: false,
                error
            });
        }
    }

    updateQuery = (query, type) => {
        this.setState({
            query: {
                ...this.state.query,
                page: 1,
                ...query,
            }
        }, () => this.refreshData(type));
    }

    componentWillMount() {
        this._isMounted = true;
        if (this.props.controller) {
            this.props.controller(this);
        }

        if (this.props.type === 'vertical') {
            this.setState({
                query: this.props.initQuery,
                resetWhenRefresh: this.props.resetWhenRefresh,
                configureProps: {
                    ...this.props.extraProps,
                    showsVerticalScrollIndicator: false,
                    horizontal: false,
                },
            }, this.refreshData);
        } else if (this.props.type === 'horizontal') {
            this.setState({
                query: this.props.initQuery,
                resetWhenRefresh: this.props.resetWhenRefresh,
                configureProps: {
                    ...this.props.extraProps,
                    showsHorizontalScrollIndicator: false,
                    horizontal: true,
                    pagingEnabled: true,
                },
            }, this.refreshData);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        if (this.state.refreshing && this.state.cancelToken) {
            this.state.cancelToken.cancel();
        }
    }

    render() {
        const header = typeof this.props.header === 'function' ? this.props.header(this.state.query) : this.props.header;
        const footer = typeof this.props.footer === 'function' ? this.props.footer(this.state.query) : this.props.footer;
        const render = (item) => this.props.render(item, this.state.query);
        return (
            <>
                {
                    this.props.filter && this.props.filter.map(
                        (filter) => (
                            <FilterBar
                                onFilterChange={
                                    (value) => this.updateQuery({ [filter.name]: value }, 'filter')
                                }
                                key={filter.key}
                                title={filter.title}
                                items={filter.items}
                            />
                        )
                    )
                }
                <FlatList
                    refreshControl={this.props.refreshControl}
                    style={this.props.containerStyle}
                    ListHeaderComponent={header}
                    ListFooterComponent={this.state.refreshing ? <Loading /> : footer}
                    renderItem={render}
                    data={this.state.data}
                    extraData={this.state.data}
                    initialNumToRender={this.state.data ? this.state.data.length : 0}
                    key={this.props.key}
                    listKey={(item, index) => ` ql-${index}`}
                    keyExtractor={(item, index) => `ql-${index}`}
                    numColumns={this.props.numColumns}
                    {...this.state.configureProps}
                />
            </>
        );
    }
};

export default compose(
    withAPI
)(QueryableList);