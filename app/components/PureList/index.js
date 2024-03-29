import React from 'react';
import { FlatList } from 'react-native';

export class PureList extends React.PureComponent {
    state = {
        refresh: false,
    }

    componentDidMount() {
        if (this.props.controller) {
            this.props.controller(this);
        }
    }

    refresh = () => this.setState({ refresh: !this.state.refresh })

    render() {
        return (
            <FlatList
                refreshControl={this.props.refreshControl}
                removeClippedSubviews={true}
                style={this.props.containerStyle}
                ListHeaderComponent={this.props.header}
                ListFooterComponent={this.props.footer}
                data={this.props.data}
                extraData={this.state}
                initialNumToRender={this.props.data ? this.props.data.length : 0}
                key={this.props.key}
                listKey={(item, index) => ` pl-${index}`}
                keyExtractor={(item, index) => `pl-${index}`}
                numColumns={this.props.numColumns}
                renderItem={this.props.render}
                horizontal={this.props.type === 'horizontal'}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            />
        );
    }
};

export default PureList;