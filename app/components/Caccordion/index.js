import React from 'react';
import { TouchableOpacity } from 'react-native';
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
        const { children, containerStyle, collapsed, collapsedStyle } = this.props;
        const styling = open ? collapsedStyle ? collapsedStyle : containerStyle : containerStyle;
        const renderCollapsed = open && ( typeof collapsed === 'function' ? collapsed(this.toggleAccordion) : collapsed );

        return (
            <TouchableOpacity activeOpacity={1} onPress={this.toggleAccordion}>
                <Card style={styling}>
                    { this.renderTitle() }
                    <Card.Content>
                        { children }
                        { renderCollapsed }
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    }
};

export default Caccordion;