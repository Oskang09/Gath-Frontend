import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import withAPI from '#extension/apisauce';
import { compose } from '#utility';

class FlatPaginator extends React.PureComponent {
    state = {
        page: 1,
        data: [],
        refreshing: true,

        configureProps: {},
    }

    refreshData = async () => {
        this.setState({ refreshing: true });
        const response = await this.props.api.request('GET', this.props.uri(this.state.page));
        this.state.data.push(...this.props.filter(response));
        this.setState({
            data: this.state.data,
            refreshing: false
        });
    }

    updatePage = () => {
        this.setState({ page: this.state.page + 1 }, this.refreshData);
    }

    componentDidMount() {
        if (this.props.type === 'topDown') {
            this.setState({
                configureProps: {
                    ...this.props.extraProps,
                    showsVerticalScrollIndicator: false,
                    horizontal: false,
                    onEndReachedThreshold: 0.5,
                    onEndReached: this.updatePage,
                    ListFooterComponent: () => {
                        return this.state.refreshing ? <ActivityIndicator /> : null;
                    },
                },
            }, this.refreshData);
        } else if (this.props.type === 'leftRight') {
            this.setState({
                configureProps: {
                    ...this.props.extraProps,
                    showsHorizontalScrollIndicator: false,
                    horizontal: true,
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
                listKey={this.props.key}
                keyExtractor={(item, index) => `list-${index}`}
                numColumns={this.props.numColumns}
                renderItem={this.props.render}
                {...this.state.configureProps}
            />
        );
    }
};

export default compose(
    withAPI
)(FlatPaginator);