import { Meteor } from 'meteor/meteor';

import { Jobs } from '..';

Meteor.publish('jobById', function( id ) {
    return Jobs.find( id );
});

Meteor.publish('jobs', function() {
    return Jobs.find();
});