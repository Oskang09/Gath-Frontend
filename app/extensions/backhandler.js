import React from 'react';
import { BackHandler } from 'react-native';
import { injector } from '#utility';

function buildComponent(
    WrappedComponent,
    backTo = null
) {
    return class extends React.Component {
        componentWillMount() {
            this._backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBack);
        }
        
        componentWillUnmount() {
            this._backHandler.remove();
        }

        handleBack = () => backTo && this.props.navigation.navigate(backTo)

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
};

export default injector(buildComponent);