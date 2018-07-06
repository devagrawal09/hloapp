import { Meteor } from "meteor/meteor";
import { Notifications } from "..";

Meteor.publish('notifications', function() {
    return Notifications.find({ user: this.userId });
});