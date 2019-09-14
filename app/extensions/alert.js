import React from 'react';
import { BackHandler, PixelRatio, Dimensions } from 'react-native';
import {
    Dialog,
    Paragraph,
    Portal,
} from 'react-native-paper';
import Button from '#components/Button';
import { injector } from '#utility';

function buildComponent(
    WrappedComponent, 
    decorator = 'showAlert',
) {
    return class extends React.Component {
        state = {
            loading: false,
            title: null,
            content: null,
            submit: null,
            customCancel: null,
            customSubmit: null,
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
                this.setState({ loading: false, title: null, content: null, submit: null, customCancel: null, customSubmit: null });
                return true;
            }
        }

        submit = async () => {
            if (this._mounted && !this.state.loading) {
                this.setState(
                    { loading: true }, 
                    () => {
                        await this.state.submit();
                        this.dismiss();
                    }
                );
            }
        }

        render() {
            const newProps = Object.assign({
                [decorator]: ({ title, content, submit, customCancel, customSubmit }) => {
                    this._backHandler = BackHandler.addEventListener('hardwareBackPress', this.dismiss);
                    this.setState({ title, content, submit, customCancel, customSubmit });
                }
            }, this.props);
            
            return (
                <>
                    <WrappedComponent
                        {...newProps}
                    />
                    {
                        this.state.submit && (
                            <Portal>
                                <Dialog visible={true} dismissable={false} theme={{ roundness: 5 }}>
                                    <Dialog.Title>{this.state.title}</Dialog.Title>
                                    <Dialog.Content>
                                        <Paragraph>
                                            { this.state.content }
                                        </Paragraph>
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        {
                                            this.state.customCancel ?
                                                this.state.customCancel(this.dismiss) :
                                                <Button
                                                    mode="text"
                                                    text="Cancel"
                                                    textStyle={{ color: '#87EFD7' }}
                                                    roundness={5}
                                                    onPress={this.dismiss}
                                                />
                                        }
                                        {
                                            this.state.customSubmit ?
                                                this.state.customSubmit(this.submit) :
                                                <Button
                                                    mode="contained"
                                                    color="#ff0000"
                                                    roundness={5}
                                                    onPress={this.submit}
                                                    text="Delete"
                                                />
                                        }
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