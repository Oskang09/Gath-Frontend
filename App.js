import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppRouter from '#app/router';

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s)',
    'Warning',
    'Remote',
]);

export default class App extends Component {
    render() {
        return (
            <PaperProvider>
                <AppRouter />
            </PaperProvider>
        );
    }
}