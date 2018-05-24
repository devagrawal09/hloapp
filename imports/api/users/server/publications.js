import { Meteor } from 'meteor/meteor';

Meteor.publish( 'user.profile', function() {
    return Meteor.users.find( this.userId );
});

Meteor.publish( 'user.name', function( user ) {
    return Meteor.users.find( user, {
        fields: { fullName: 1 }
    });
});
