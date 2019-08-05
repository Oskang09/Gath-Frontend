import React from 'react';

import CreateEvent from './create_event';
import EventDescription from './event_description';
import ShopList from './shop_list';
import StepContainer from '#components/StepContainer';

import withAPI from '#extension/apisauce';
import { compose } from '#utility';

export class CreateEventForm extends React.Component {
    render() {
        return (
            <StepContainer
                containers={[ CreateEvent, EventDescription, ShopList ]}
                onComplete={
                    async (state) => {
                        const result = await this.props.api.request('POST', '/events', state);
                        
                        this.props.navigation.navigate('home');
                    }
                }
            />
        )
    }
};

export default compose(
    withAPI
)(CreateEventForm);