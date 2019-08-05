import React from 'react';
import Carousel from 'react-native-snap-carousel';

export class CarouselList extends React.PureComponent {
    state = {
        refresh: false,
    }
    carouselRef = null

    componentWillMount() {
        if (this.props.ref) {
            this.props.ref(this);
        }
    }

    getIndex() {
        return this.carouselRef.getIndex();
    }

    refresh = () => this.setState({ refresh: !this.state.refresh })

    render() {
        return (
            <Carousel
                ref={(ref) => this.carouselRef = ref}
                layout={this.props.layout || 'default'}
                sliderWidth={this.props.containerWidth}
                itemWidth={this.props.itemWidth}
                data={this.props.data}
                renderItem={this.props.render}
            />
        );
    }
};

export default CarouselList;