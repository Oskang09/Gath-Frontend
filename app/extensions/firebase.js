import React from 'react';
import Firebase from 'react-native-firebase';
import { injector } from '#utility';

const authenticate = Firebase.auth();
function buildComponent(
    WrappedComponent, 
    login = 'login',
    user = 'user'
) {
    return class extends React.Component {
        render() {
            const newProps = Object.assign({
                [login]: (email, password) => authenticate.signInWithEmailAndPassword(email, password),
                [user]: authenticate.currentUser,
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