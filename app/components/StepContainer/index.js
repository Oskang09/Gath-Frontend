import React from 'react';

export class StepContainer extends React.Component {
    state = {
        step: 0,
        maxSteps: this.props.containers.length,
        containerState: [],
    }

    nextStep = (state) => {
        const { containerState, step, maxSteps } = this.state;
        containerState.push(state);
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
                getState={(index = this.state.step) => this.state.containerState[index]}
                nextStep={this.nextStep}
            />
        );
    }
};

export default StepContainer;