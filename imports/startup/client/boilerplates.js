import { Meteor } from 'meteor/meteor';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/shared-components/loading';

export const commonRoutesAction = ({ caregiver, customer })=> {
    Meteor.call('user.getType', ( err, res )=> {
        if ( res === 'caregiver' ) {
            caregiver.import().then(()=> {
                BlazeLayout.render( 'AppLayout', caregiver.render );
            });
        } else {
            customer.import().then(()=> {
                BlazeLayout.render( 'AppLayout', customer.render );
            });
        }
    });
}

export const showLoader = ()=> {
    // BlazeLayout.render( 'AppLayout', { main: 'DashboardLayout', content: 'loading' });
}
