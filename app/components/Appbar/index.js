import React from 'react';
import { Animated } from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import AsyncContainer from '#components/AsyncContainer';
import withAPI from '#extension/apisauce';
import withDevice from '#extension/device';
import withNavigator from '#extension/navigator';
import { withNavigation } from 'react-navigation';
import { compose } from '#utility';

export class TopBar extends React.PureComponent {
    state = {
        searchQuery: '',
        searchBar: false,
        searchWidth: new Animated.Value(0),
        profile: this.props.profileId || 'me'
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
                        () => this.state.profile === 'me' ? 
                            this.props.navigator.switchTo('history') :
                            this.props.navigator.push({
                                routeName: 'history',
                                params: {
                                    id: this.state.profile
                                }
                            })
                    }
                />
                {
                    this.props.profileId === 'me' && (
                        <>
                            <Appbar.Action
                                icon="local-activity"
                                size={25}
                                color="black"
                                onPress={
                                    () => this.props.navigator.switchTo('vouchers')
                                }
                            />
                            <Appbar.Action
                                icon="notifications"
                                size={25}
                                color="black"
                                onPress={
                                    () => this.props.navigator.switchTo('notifications')
                                }
                            />
                        </>
                    )
                }
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
                    onChangeText={
                        (searchQuery) => this.setState(
                            { searchQuery }, 
                            () => this.props.onSearchChange && this.props.onSearchChange(searchQuery)
                        )
                    }
                    value={searchQuery}
                />
                { this.renderSearchAction() }
            </>
        );
    }

    renderAppbarContent = (subtitle, event = undefined) => (
        <Appbar.Content
            title={this.props.title || 'Gath'}
            titleStyle={{ color: '#87EFD7' }}
            subtitle={subtitle && subtitle}
            onPress={
                () => event && this.props.navigator.push({
                    routeName: 'event_detail',
                    params: event
                })
            }
        />
    )

    getSearchContent = () => this.state.searchQuery

    render() {
        const { search, profileBar, eventTrack = true } = this.props;
        return (
            <Appbar theme={{ colors: { primary: '#FFFFFF' }}}>
                {
                    eventTrack ? (
                        <AsyncContainer
                            loading={this.renderAppbarContent}
                            error={() => this.renderAppbarContent()}
                            promise={{
                                event: this.props.api.build('GET', '/events/running')
                            }}
                        >
                            { 
                                ({ event }) =>  this.renderAppbarContent(`Event is running ...`, event)
                            }
                        </AsyncContainer>
                    ) : this.renderAppbarContent()
                }
                { profileBar && this.renderProfileAction() }
                { search && this.renderSearch() }
            </Appbar>
        );
    }
};

export default compose(
    withNavigator,
    withDevice,
    withNavigation,
    withAPI,
)(TopBar);