import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AppRouter from './Router';
import { NetInfo, View } from 'react-native';
import Loading from '#components/Loading';

const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 5,
    colors: {
        ...DefaultTheme.colors,
        primary: '#87EFD7',
    }
};

export default class App extends React.Component {
    state = {
        hasInternet: false,
    }

    componentWillMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.connectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.connectivityChange);
    }

    connectivityChange = (hasInternet) => this.setState({ hasInternet })

    render() {
        return (
            <PaperProvider theme={theme}>
                <AppRouter />
            </PaperProvider>
        );
    }
};