import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Card } from 'react-native-paper';

export class Caccordion extends React.PureComponent {
    state = {
        open: false,
    }

    openAccordion = () => {
        this.setState({ open: true })
    }

    closeAccordion = () => {
        this.setState({ open: false });
    }

    renderButton = () => (
        <TouchableOpacity onPress={ this.state.open ? this.closeAccordion : this.openAccordion }>
            <View style={{ alignItems: 'center' }}>
                <Text>Show {this.state.open ? 'Less' : 'More'}</Text>
            </View>
        </TouchableOpacity>
    );

    render() {
        const { open } = this.state;
        const { content, cardStyle, title, collapsed } = this.props;
        return (
            <Card style={cardStyle}>
                <Card.Title title={title} subtitle={!open && collapsed} />
                <Card.Content>
                    { open && content }
                    { this.renderButton() }
                </Card.Content>
            </Card>
        );
    }
};

export default Caccordion;