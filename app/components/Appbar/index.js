import React from 'react';
import { Animated, Text } from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import withDevice from '#extension/device';
import { withNavigation } from 'react-navigation';
import { compose } from '#utility';
import { TouchableOpacity } from 'react-native-gesture-handler';

export class TopBar extends React.PureComponent {
    state = {
        searchQuery: '',
        searchBar: false,
        searchWidth: new Animated.Value(0),
    }
    searchRef = null

    renderProfileAction = () => {
        return (
            <>
                <Appbar.Action
                    icon="event"
                    size={25}
                    color="black"
                    onPress={
                        () => {
                            this.props.navigation.navigate('events');
                        }
                    }
                />
                <Appbar.Action
                    icon="local-activity"
                    size={25}
                    color="black"
                    onPress={
                        () => {
                            this.props.navigation.navigate('vouchers');
                        }
                    }
                />
                <Appbar.Action
                    icon="notifications"
                    size={25}
                    color="black"
                    onPress={
                        () => {
                            this.props.navigation.navigate('notifications');
                        }
                    }
                />
            </>
        );
    }

    renderSearchAction = () => {
        const { searchBar, searchWidth } = this.state;
        if (searchBar) {
            return (
                <Appbar.Action
                    icon="cancel"
                    size={25}
                    color="#87EFD7"
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
                                this2.setState({ searchBar: false });
                            });
                        }
                    }
                />
            );
        }
        return (
            <Appbar.Action
                icon="search"
                size={25}
                color="#87EFD7"
                onPress={
                    () => {
                        const this2 = this;
                        this.setState({ searchBar: true });
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
        );
    }
    
    renderSearch = () => {
        const { searchQuery, searchWidth } = this.state;
        return (
            <>
                <Searchbar
                    icon={(props) => <MaterialIcon {...props} name="search" color="#87EFD7" />}
                    ref={ref => this.searchRef = ref}
                    style={{ width: searchWidth }}
                    placeholder="Search something ..."
                    onChangeText={searchQuery => this.setState({ searchQuery })}
                    value={searchQuery}
                />
                { this.renderSearchAction() }
            </>
        );
    }

    handleHome = () => this.props.navigation.navigate('home')

    render() {
        const { search, profileBar, home, title } = this.props;
        return (
            <Appbar theme={{ colors: { primary: '#FFFFFF' }}}>
                <Appbar.Content
                    title={title || 'Gath'}
                    titleStyle={{ color: '#87EFD7' }}
                    onPress={home && this.handleHome}
                />
                { profileBar && this.renderProfileAction() }
                { search && this.renderSearch() }
            </Appbar>
        );
    }
};

export default compose(
    withDevice,
    withNavigation
)(TopBar);