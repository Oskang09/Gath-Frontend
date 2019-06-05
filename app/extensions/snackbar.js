import React from 'react';
import { Snackbar } from 'react-native-paper';
import { injector } from '#utility';

function buildComponent(
    WrappedComponent,
    snackbar = 'snackbar'
) {
    return class extends React.Component {
        state = { visible: false, message: '' };
    
        showSnackbar = (message) => {
            this.setState({
                visible: true,
                message
            });
        }
        
        render() {
            const newProps = Object.assign({
                [snackbar]: this.showSnackbar
            }, this.props);

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
                        {...newProps}
                    />
                </>
            );
        }
    };
};

export default injector(buildComponent);