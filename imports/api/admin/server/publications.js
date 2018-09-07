import { Meteor } from 'meteor/meteor';

import userChecks from '../../users/checks.js';

Meteor.publish('admin.users', function() {

    userChecks.loggedIn( this.userId );
    userChecks.isAdmin( this.userId );

    return Meteor.users.find();
});