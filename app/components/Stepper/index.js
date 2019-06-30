import React from 'react';
import { View } from 'react-native';

export class Stepper extends React.PureComponent {
    render() {
        const { maxSteps, currentStep, containerStyle, activeStep, inactiveStep } = this.props;
        const steps = [];

        for ( i = 1; i <= maxSteps; i++) {
            steps.push(currentStep >= i ? activeStep : inactiveStep);
        }
        return (
            <View style={containerStyle}>{steps}</View>
        );
    }
};

export default Stepper;