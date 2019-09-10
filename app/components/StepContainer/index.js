import React from 'react';
import { BackHandler } from 'react-native';

export class StepContainer extends React.Component {
    state = {
        step: 0,
        maxSteps: this.props.containers.length,
        containerState: this.props.defaultState || [],
        backHandler: [],
    }

    componentWillMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    }
    
    componentWillUnmount() {
        this.backHandler.remove();
    }

    handleBack = () => this.state.backHandler[this.state.step] ?
        this.state.backHandler[this.state.step]() : 
        this.prevStep();

    prevStep = () => {
        const { containerState, step } = this.state;
        if (step > 0) {
            this.setState(
                { step: step - 1 }, 
                () => this.props.onPrev && this.props.onPrev(containerState, step - 1)
            );
        }
        return true;
    }

    nextStep = (state) => {
        const { containerState, step, maxSteps } = this.state;
        containerState[step] = state;
        if (step >= maxSteps - 1) {
            this.complete(containerState);
        } else {
            this.setState(
                { step: step + 1, containerState }, 
                () => this.props.onNext && this.props.onNext(containerState, step + 1)
            );
        }
    }

    complete = (allState) => this.props.onComplete && this.props.onComplete(allState);

    render() {
        const Component = this.props.containers[this.state.step];
        return (
            <Component
                {...this.props}
                getState={(index = this.state.step) => this.state.containerState[index] || {}}
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                backHandler={
                    (handler, index = this.state.step) => {
                        this.state.backHandler[index] = handler;
                        this.setState({ backHandler: this.state.backHandler })
                    }
                }
            />
        );
    }
};

export default StepContainer;