import React from 'react';
import { Snackbar } from 'react-native-paper';

/**
 * @example Accessing from HOC Component using `this.props.snackbar('message')`
 * @param {Component} [WrappedComponent] HOC Components for Inject 
 */
function withSnackbar(WrappedComponent) {
    return class extends React.Component {
        state = { visible: false, message: '' };
    
        showSnackbar = (msg) => {
            this.setState({
                visible: true,
                message: msg
            });
        }
        
        render() {
            return (
                <>
                    <Snackbar
                        visible={this.state.visible}
                        onDismiss={() => this.setState({ visible: false })}
                        action={{
                            label: 'Undo',
                            onPress: () => {

                            },
                        }}
                    >
                        {this.state.message}
                    </Snackbar>
                    <WrappedComponent
                        snackbar={this.showSnackbar} 
                        {...this.props}
                    />
                </>
            );
        }
    };
};

export {
    withSnackbar
};