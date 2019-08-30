import React from 'react';
import { View } from 'react-native';
import { compose } from '#utility';
import withDevice from '#extension/device';
import withAPI from '#extension/apisauce';
import AsyncContainer from '#components/AsyncContainer';

export class VoucherScreen extends React.PureComponent {
    state = {
        voucher: this.props.api.request('GET', '/users/voucher')
    }
    render() {
        return (
            <View>

            </View>
        );
    }
};

export default compose(
    withAPI,
    withDevice
)(VoucherScreen);