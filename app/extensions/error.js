import React from 'react';
import {
    Dialog,
    Button,
    Paragraph
} from 'react-native-paper';
import { injector } from '#utility';

function buildComponent(
    WrappedComponent, 
    decorator = 'showError',
) {
    return class extends React.Component {
        state = {
            error: null,
        }
        
        render() {
            const newProps = Object.assign({
                [decorator]: (error) => this.setState({ error })
            }, this.props);
            
            return (
                <>
                    <WrappedComponent
                        {...newProps}
                    />
                    {
                        this.state.error && (
                            <Dialog
                                visible={true}
                                onDismiss={() => this.setState({ error: null })}
                                theme={{ roundness: 5 }}
                            >
                                <Dialog.Content>
                                    <Paragraph>{this.state.error}</Paragraph>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button 
                                        onPress={() => this.setState({ error: null })}
                                    >OK</Button>
                                </Dialog.Actions>
                            </Dialog>
                        )
                    }
                </>
            );
        }
    };
};

export default injector(buildComponent);