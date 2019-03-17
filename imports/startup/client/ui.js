import { Meteor } from 'meteor/meteor';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/shared-components/loading';
import showAlert from '../../ui/shared-components/alert';

export default {
    commonRoutesAction({ caregiver, customer }) {
        Meteor.call('user.isCaregiver', ( err, res )=> {
            if ( res ) {
                caregiver.import().then(()=> {
                    BlazeLayout.render( 'AppLayout', caregiver.render );
                });
            } else {
                customer.import().then(()=> {
                    BlazeLayout.render( 'AppLayout', customer.render );
                });
            }
        });
    },
    showLoader() {
        BlazeLayout.render( 'AppLayout', { main: 'loading' });
    },
    showDBLoader() {
        BlazeLayout.render('AppLayout', { main: 'DashboardLayout', content: 'loading' });
    },
    showAlert
}
