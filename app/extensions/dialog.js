import React from 'react';
import { BackHandler } from 'react-native';
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

        _mounted = false

        componentWillMount() {
            this._mounted = true;
        }
        
        componentWillUnmount() {
            this._mounted = false;
        }

        dismiss = () => {
            if (this._mounted) {
                this._backHandler.remove();
                this.setState({ dialog: null });
                return true;
            }
        }

        render() {
            const newProps = Object.assign({
                [decorator]: (dialog) => {
                    this._backHandler = BackHandler.addEventListener('hardwareBackPress', this.dismiss);
                    this.setState({ dialog });
                }
            }, this.props);
            
            return (
                <>
                    <WrappedComponent
                        {...newProps}
                    />
                    {
                        this.state.dialog && (
                            <Portal>
                                <Dialog visible={true} dismissable={false} theme={{ roundness: 5 }}>
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
                                        <Button onPress={this.dismiss}>OK</Button>
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