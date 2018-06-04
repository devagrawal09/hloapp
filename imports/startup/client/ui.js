import { Meteor } from 'meteor/meteor';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/shared-components/loading';
import showAlert from '../../ui/shared-components/alert';

export default {
    commonRoutesAction({ caregiver, customer }) {
        Meteor.call('user.getType', ( err, res )=> {
            if ( res === 'caregiver' ) {
                caregiver.import().then(()=> {
                    BlazeLayout.render( 'AppLayout', caregiver.render );
                });
            } else if ( res === 'customer' ) {
                customer.import().then(()=> {
                    BlazeLayout.render( 'AppLayout', customer.render );
                });
            }
        });
    },
    showLoader() {
        // BlazeLayout.render( 'AppLayout', { main: 'DashboardLayout', content: 'loading' });
    },
    showAlert
}
