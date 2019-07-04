import React, { Component } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AppRouter from './Router';

const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 20,
    colors: {
        ...DefaultTheme.colors,
        primary: '#F7B500',
        accent: '#FFF1D1',
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