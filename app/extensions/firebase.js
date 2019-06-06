import React from 'react';
import Firebase from 'react-native-firebase';
import { injector } from '#utility';

const authenticate = Firebase.auth();
function buildComponent(
    WrappedComponent, 
    login = 'login',
    logout = 'logout',
    user = 'firebaseUser'
) {
    return class extends React.Component {
        render() {
            const newProps = Object.assign({
                [login]: (email, password) => authenticate.signInWithEmailAndPassword(email, password),
                [logout]: () => authenticate.signOut(),
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