import React from 'react';
import {
    Dialog,
    Button,
    Paragraph,
    Portal,
} from 'react-native-paper';
import { injector } from '#utility';

function buildComponent(
    WrappedComponent, 
    decorator = 'showDialog',
) {
    return class extends React.Component {
        state = {
            dialog: null,
        }

        dismiss = () => this.setState({ dialog: null })

        render() {
            const newProps = Object.assign({
                [decorator]: (dialog) => this.setState({ dialog })
            }, this.props);
            
            return (
                <>
                    <WrappedComponent
                        {...newProps}
                    />
                    {
                        this.state.dialog && (
                            <Portal>
                                <Dialog
                                    visible={true}
                                    onDismiss={this.dismiss}
                                    theme={{ roundness: 5 }}
                                >
                                    <Dialog.Content>
                                        <Paragraph>
                                        {
                                            this.state.dialog instanceof Error ?
                                                this.state.dialog.message :
                                                this.state.dialog.toString()
                                        }
                                        </Paragraph>
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <Button onPress={this.dismiss} >OK</Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>
                        )
                    }
                </>
            );
        }
    };
};

export default injector(buildComponent);