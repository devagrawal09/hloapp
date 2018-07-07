import { Template } from 'meteor/templating';

import { Notifications } from '../../../api/notifications';

import './dashboard-layout.html';

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('notifications');
}

Template.DashboardLayout.onCreated(function() {
    this.subscribe('notifications');
});

Template.DashboardLayout.helpers({
    msgNotifications() {
        return Notifications.find({
            user: Meteor.userId(),
            type: 'msg'
        }).count();
    },
    jobNotifications() {
        return Notifications.find({
            user: Meteor.userId(),
            type: 'job'
        }).count();
    }
});