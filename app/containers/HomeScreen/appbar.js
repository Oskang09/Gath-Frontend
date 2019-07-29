import React from 'react';
import { Animated } from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';

import withDevice from '#extension/device';
import { compose } from '#utility';

export class TopBar extends React.PureComponent {
    state = {
        searchQuery: '',
        searchButton: true,
        searchWidth: new Animated.Value(0),
    }
    searchRef = null

    render() {
        const { searchQuery, searchButton, searchWidth } = this.state;
        return (
            <Appbar>
                <Appbar.Content title="Gath" />
                {
                    !searchButton && 
                    <Searchbar
                        ref={ref => this.searchRef = ref}
                        style={{ width: searchWidth }}
                        placeholder="Search something ..."
                        onChangeText={searchQuery => this.setState({ searchQuery })}
                        value={searchQuery}
                    />
                }
                {
                    searchButton ?
                        <Appbar.Action
                            icon="search"
                            size={25}
                            onPress={
                                () => {
                                    const this2 = this;
                                    this.setState({ searchButton: false });
                                    Animated.timing(
                                        searchWidth, 
                                        {
                                            toValue: this.props.device.getX(75),
                                            duration: 750,
                                        }
                                    ).start(() => {
                                        if (this2.searchRef) {
                                            this2.searchRef.focus();
                                        }
                                    });
                                }
                            }
                        /> 
                        :
                        <Appbar.Action
                            icon="cancel"
                            size={25}
                            onPress={
                                () => {
                                    const this2 = this;
                                    Animated.timing(
                                        searchWidth,
                                        { 
                                            toValue: 0,
                                            duration: 750,
                                        }
                                    ).start(() => {
                                        this2.setState({ searchButton: true });
                                    });
                                }
                            }
                        />
                }
            </Appbar>
        );
    }
};

export default compose(
    withDevice
)(TopBar);