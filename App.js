import React, { Component } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AppRouter from './Router';

const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 5,
    colors: {
        ...DefaultTheme.colors,
        primary: '#87EFD7',
    }
};

export default class App extends Component {
    render() {
        return (
            <PaperProvider theme={theme}>
                <AppRouter />
            </PaperProvider>
        );
    }
};