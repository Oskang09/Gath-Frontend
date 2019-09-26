import React from 'react';

import EventInfo from './event_info';
import EventDescription from './event_description';
import ShopList from './shop_list';
import StepContainer from '#components/StepContainer';
import Button from '#components/Button';

import withAlert from '#extension/alert';
import withFirebase from '#extension/firebase';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import withNavigator from '#extension/navigator';
import withDialog from '#extension/dialog';
import { compose } from '#utility';

export class EventForm extends React.Component {

    render() {
        const state = [];
        let isUpdate = false;
        if (this.props.navigation.state.params) {
            isUpdate = true;

            const {
                type, name, start_time: start, image,
                desc,
                shop, location,
            } = this.props.navigation.state.params;

            state.push({ type, name, start, image });
            state.push(desc);
            state.push({ shop, location });
        }
        return (
            <StepContainer
                {...this.props}
                defaultState={state}
                containers={[ EventInfo, EventDescription, ShopList ]}
                onComplete={
                    async (state) => this.props.showAlert({
                        title: isUpdate ? 'Update Event' : 'Create Event',
                        content: '',
                        customSubmit: (submit, isLoading) => (
                            <Button
                                mode="contained"
                                text="Create"
                                color="#CCCCCC"
                                textStyle={{ color: '#ffffff' }}
                                roundness={5}
                                onPress={submit}
                                loading={isLoading}
                            />
                        ),
                        submit: async () => {
                            if (isUpdate) {
                                await this.props.api.request('PUT', `/events/${this.props.navigation.state.params.id}`, state);
                                return this.props.navigator.back();
                            }
                            const response = await this.props.api.request('POST', '/events', state);
                            this.props.navigator.replace({
                                routeName: 'event_detail',
                                params: response
                            });
                        }
                    })
                }
            />
        )
    }
};

export default compose(
    withAPI,
    withDevice,
    withFirebase,
    withAlert,
    withDialog,
    withNavigator
)(EventForm);