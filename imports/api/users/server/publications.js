import { Meteor } from 'meteor/meteor';

Meteor.publish( 'user.profile', function() {
    return Meteor.users.find( this.userId, {
        fields: {
            firstName: 1,
            lastName: 1,
            gender: 1
        }
    });
});
