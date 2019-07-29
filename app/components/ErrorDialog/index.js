import React from 'react';
import { Portal, Dialog, Paragraph, Button } from 'react-native-paper';


function ErrorDialog({ error, dismiss }) {
    return (
        <Portal>
            <Dialog
                visible={error}
                onDismiss={dismiss}
                theme={{ roundness: 5 }}
            >
                <Dialog.Content>
                    <Paragraph>{error}</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={dismiss}>OK</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default ErrorDialog;