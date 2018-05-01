import { Meteor } from 'meteor/meteor';

Meteor.publish( 'user.profile', function() {
    return Meteor.users.find( this.userId, {
        fields: {
            firstName: 1,
            lastName: 1,
            fullName: 1,
            gender: 1,
            phone: 1,
            address: 1,
            district: 1,
            otherDistrict: 1,
            country: 1,
            bookmarks: 1
        }
    });
});
