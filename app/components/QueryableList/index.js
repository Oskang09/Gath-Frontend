import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
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
    }
    _isMounted = false

    refreshData = async () => {
        this.setState({ refreshing: true });
        const response = await this.props.api.request('GET', this.props.uri(this.state.query));
        if (!this._isMounted) {
            return null;
        }
        if (this.state.resetWhenRefresh) {
            this.state.data = this.props.extract(response);
        } else {
            this.state.data.push(...this.props.extract(response));
        }
        this.setState({
            data: this.state.data,
            refreshing: false
        });
    }

    updateQuery = (query) => {
        if (query) {
            this.setState({
                query: {
                    ...this.state.query,
                    ...query,
                }
            }, this.refreshData);
        } else {
            this.setState({
                query: {
                    ...this.state.query,
                    ...this.props.updateQuery(this.state.query)
                }
            }, this.refreshData);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillMount() {
        this._isMounted = true;
        if (this.props.ref) {
            this.props.ref(this);
        }

        if (this.props.type === 'vertical') {
            this.setState({
                query: this.props.initQuery,
                resetWhenRefresh: this.props.resetWhenRefresh,
                configureProps: {
                    ...this.props.extraProps,
                    horizontal: false,
                    showsVerticalScrollIndicator: false,
                    ListFooterComponent: () => {
                        return this.state.refreshing ? <ActivityIndicator /> : null;
                    },
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

    render() {
        return (
            <>
                {
                    this.props.filter && this.props.filter.map(
                        (filter) => (
                            <FilterBar
                                onFilterChange={
                                    (value) => this.updateQuery({
                                        [filter.name]: value
                                    })
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