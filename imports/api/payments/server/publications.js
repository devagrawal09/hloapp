import { Meteor } from "meteor/meteor";
import { Payments } from "..";

Meteor.publish('job.payment', function( job ) {
    return Payments.find({ job });
});