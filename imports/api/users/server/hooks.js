import { Accounts } from 'meteor/accounts-base';
import { HTTP } from 'meteor/http';

Accounts.onCreateUser( function( options, user ) {      //create new caregivers
    
    let first = last = email = '';
    if( user.services.facebook ) {
        first = user.services.facebook.first_name;
        last = user.services.facebook.last_name;
        email = user.services.facebook.email;
    } else {
        first = options.profile.firstName;
        last = options.profile.lastName;
        email = options.profile.emailAddress;
    }

    options.profile.isCaregiver = false;

    let listId = Meteor.settings.mailchimp.customers_list;

    user.firstName = first;
    user.lastName = last;
    user.fullName = `${first} ${last}`;
    user.profile = options.profile;
    user.numbers = [];
    user.createdOn = new Date();

    if( !user.emails ) {
        if( email ) user.emails = [{ address: email, verified: true }];
        else return user;
    }

    if( !user.username ) {
        user.username = user.emails[0].address.split('@')[0];
    }

    HTTP.post(`https://us13.api.mailchimp.com/3.0/lists/${listId}/members`, {
        auth: 'hlo:f01420e7b8912b1b6115b77c7b17ed4c-us13',
        data: {
            email_address: user.emails[0].address,
            status: 'subscribed'
        }
    }, ( err )=> {
        if( err ) console.error( err );
    });

    Meteor.users.notifications.welcome( user );

    return user;
});
