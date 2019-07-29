import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
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

    refreshData = async () => {
        this.setState({ refreshing: true });
        const response = await this.props.api.request('GET', this.props.uri(this.state.query));
        if (this.state.resetWhenRefresh) {
            this.state.data = this.props.filter(response);
        } else {
            this.state.data.push(...this.props.filter(response));
        }
        this.setState({
            data: this.state.data,
            refreshing: false
        });
    }

    updatePage = () => {
        this.setState({ 
            query: {
                ...this.state.query,
                ...this.props.updateQuery(this.state.query)
            }
        }, this.refreshData);
    }

    componentDidMount() {
        if (this.props.type === 'vertical') {
            this.setState({
                query: this.props.initQuery,
                resetWhenRefresh: this.props.resetWhenRefresh,
                configureProps: {
                    ...this.props.extraProps,
                    horizontal: false,
                    showsVerticalScrollIndicator: false,
                    onEndReachedThreshold: 0.5,
                    onEndReached: this.updatePage,
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
        );
    }
};

export default compose(
    withAPI
)(QueryableList);