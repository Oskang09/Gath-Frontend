import React from 'react';

import EventInfo from './event_info';
import EventDescription from './event_description';
import ShopList from './shop_list';
import StepContainer from '#components/StepContainer';

import withFirebase from '#extension/firebase';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import { compose } from '#utility';

export class EventForm extends React.Component {

    render() {
        const state = [];
        if (this.props.navigation.state.params) {
            const {
                type, name, start_time: start, id,
                desc,
                shop
            } = this.props.navigation.state.params;

            state.push({ type, name, start, id });
            state.push(desc);
            state.push(shop);
        }
        return (
            <StepContainer
                {...this.props}
                defaultState={state}
                containers={[ EventInfo, EventDescription, ShopList ]}
                onComplete={
                    async (state) => {
                        if (this.props.navigation.state.params) {
                            await this.props.api.request('PUT', `/events/${this.props.navigation.state.params.id}`, state);
                        } else {
                            await this.props.api.request('POST', '/events', state);
                        }

                        this.props.navigation.navigate('home');
                    }
                }
            />
        )
    }
};

export default compose(
    withAPI,
    withDevice,
    withFirebase
)(EventForm);