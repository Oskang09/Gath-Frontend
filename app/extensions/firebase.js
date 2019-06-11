import React from 'react';
import Firebase from 'react-native-firebase';
import { injector } from '#utility';

const authenticate = Firebase.auth();
function buildComponent(
    WrappedComponent, 
    decorator = 'firebase',
) {
    return class extends React.Component {
        render() {
            const newProps = Object.assign({
                [decorator]: {
                    login: (number) => authenticate.signInWithPhoneNumber(number, true),
                    logout: () => authenticate.signOut(),
                    getUser: () => authenticate.currentUser,
                }
            }, this.props);
            
            return (
                <WrappedComponent
                    {...newProps}
                />
            );
        }
    };
};

export default injector(buildComponent);