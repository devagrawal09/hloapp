import { Meteor } from 'meteor/meteor';

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