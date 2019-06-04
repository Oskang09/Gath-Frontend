import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from 'app/navigator';

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s)',
    'Warning',
    'Remote',
]);

export default class App extends Component {
    render() {
        return (
            <PaperProvider>
                <AppNavigator />
            </PaperProvider>
        );
    }
}