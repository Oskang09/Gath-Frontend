import React from 'react';
import withFirebase from '#extension/firebase';
import withPixel from '#extension/pixels';

import { View } from 'react-native';
import { Avatar, TextInput, Button, Text } from 'react-native-paper';
import { compose } from '#utility';

export class LoginScreen extends React.PureComponent {
    state = {
        username: '',
        password: '',
        loading: false,
        error: null,
    }

    render() {
        return (
            <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                <Avatar.Image
                    style={{ marginBottom: this.props.getY(10) }}
                    size={128}
                    source={require('#assets/icon.jpg')}
                />
                <View 
                    width={this.props.getX(65)}
                    style={{ marginBottom: this.props.getY(5) }}
                >
                    <TextInput
                        label='Username'
                        value={this.state.username}
                        onChangeText={username => this.setState({ username })}
                    />
                </View>
                <View
                    width={this.props.getX(65)}
                    style={{ marginBottom: this.props.getY(5) }}
                >
                    <TextInput
                        label='Password'
                        secureTextEntry={true}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                    />
                </View>
                <View>
                <Button
                    width={this.props.getX(35)}
                    mode="contained"
                    loading={this.state.loading}
                    onPress={async () => {
                        if (!this.state.loading) {
                            this.setState({
                                loading: true,
                                error: null
                            });

                            try {
                                await this.props.login(this.state.username, this.state.password);
                                this.props.navigation.navigate('home');
                            } catch (error) {
                                this.setState({
                                    loading: false,
                                    error: 'Error occurs: ' + JSON.stringify(error.message)
                                });
                            }
                        }
                    }}
                >
                    LOGIN
                </Button>
                {
                    this.state.error && 
                    <View>
                        <Text>{this.state.error}</Text>
                    </View>
                }
                </View>
            </View>
        );
    }
};

export default compose(
    withFirebase,
    withPixel
)(LoginScreen);