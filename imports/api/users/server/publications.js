import { Meteor } from 'meteor/meteor';

import { UserImages } from '..';

Meteor.publish( 'user.profile', function() {
    return [
        Meteor.users.find( this.userId ),
        UserImages.find({ meta: { user: Meteor.userId() } }).cursor
    ];
});

Meteor.publish( 'user.name', function( user ) {
    return Meteor.users.find( user, {
        fields: { fullName: 1 }
    });
});
