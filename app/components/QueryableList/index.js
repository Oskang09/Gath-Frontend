import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
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

        this.setState({ refreshing: true });

        const { _meta, ok, result, error } = await this.props.api.request('GET', this.props.uri(this.state.query));
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
                    configureProps: {
                        ...this.state.configureProps,
                        onEndReached: isEnd ? undefined : this.updateQuery({ page: _meta.currentPage + 1 }, 'paginate'),
                        onEndReachedThreshold: isEnd ? undefined : 0.7,
                        ListFooterComponent: isEnd ? 
                            this.props.footer :
                            this.state.refreshing && <ActivityIndicator />,
                    }
                });
            } else {
                this.setState({
                    data: this.state.data,
                    refreshing: false,
                });
            }
        } else {
            this.setState({
                data: this.state.data,
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
                    horizontal: true
                },
            }, this.refreshData);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
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
                    style={this.props.containerStyle}
                    ListHeaderComponent={this.props.header}
                    data={this.state.data}
                    extraData={this.state.data}
                    initialNumToRender={this.state.data.length}
                    refreshing={this.state.refreshing}
                    key={this.props.key}
                    listKey={(item, index) => ` ql-${index}`}
                    keyExtractor={(item, index) => `ql-${index}`}
                    numColumns={this.props.numColumns}
                    renderItem={this.props.render}
                    {...this.state.configureProps}
                />
            </>
        );
    }
};

export default compose(
    withAPI
)(QueryableList);