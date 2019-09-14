import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Card } from 'react-native-paper';

export class Caccordion extends React.PureComponent {
    state = {
        open: false,
    }

    renderTitle = () => {
        const { title, subtitle } = this.props;
        if (!title && !subtitle) {
            return null;
        }
        return (
            <Card.Title
                title={typeof title === 'function' ? title(this.state.open) : title}
                titleStyle={{ fontSize: 15 }}
                subtitle={typeof subtitle === 'function' ? subtitle(this.state.open) : subtitle}
            />
        );
    }

    toggleAccordion = () => this.setState({ open: !this.state.open })

    render() {
        const { open } = this.state;
        const { children, containerStyle, collapsed, collapsedStyle, showButton } = this.props;
        if (showButton) {
            return (
                <Card style={open ? collapsedStyle : containerStyle}>
                    { this.renderTitle() }
                    <Card.Content>
                        { children }
                        { open && collapsed}
                        <TouchableOpacity activeOpacity={1} onPress={this.toggleAccordion}>
                            <View style={{ alignItems: 'center' }}>
                                <Text>Show {this.state.open ? 'Less' : 'More'}</Text>
                            </View>
                        </TouchableOpacity>
                    </Card.Content>
                </Card>
            );
        }
        return (
            <TouchableOpacity activeOpacity={1} onPress={this.toggleAccordion}>
                <Card style={open ? collapsedStyle : containerStyle}>
                    { this.renderTitle() }
                    <Card.Content>
                        { children }
                        { open && collapsed }
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    }
};

export default Caccordion;