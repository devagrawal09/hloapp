import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'user.getType'() {
        return Meteor.users.findOne( this.userId ).profile.type;
    }
});
