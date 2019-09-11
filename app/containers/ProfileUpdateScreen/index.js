import React from 'react';

import UserDetail from './user-details';
import Personality from './personality';
import Introduction from './introduction';

import StepContainer from '#components/StepContainer';

import withFirebase from '#extension/firebase';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import withDialog from '#extension/dialog';
import { compose } from '#utility';

export class ProfileUpdate extends React.Component {

    render() {
        const state = [];
        if (this.props.navigation.state.params) {
            const {
                name, age, constellation, gender, utag, id,
                personality,
                desc
            } = this.props.navigation.state.params;

            state.push({ id, name, age, constellation, gender, utag });
            state.push(personality);
            state.push(desc);
        }

        return (
            <StepContainer
                {...this.props}
                defaultState={state}
                containers={[ UserDetail, Personality, Introduction ]}
                onComplete={
                    async (state) => {
                        try {
                            await this.props.api.request(
                                'POST', 
                                `/users/profile`,
                                {
                                    name: state[0].name,
                                    age: state[0].age,
                                    constellation: state[0].constellation,
                                    gender: state[0].gender,
                                    avatar: state[0].avatar,
                                    utag: state[0].utag,

                                    personality: state[1],
                                    desc: state[2],
                                }
                            );
                            this.props.navigation.navigate('profile');
                        } catch (error) {
                            this.props.showDialog(error.message);
                        }
                    }
                }
            />
        )
    }
};

export default compose(
    withAPI,
    withDevice,
    withFirebase,
    withDialog
)(ProfileUpdate);