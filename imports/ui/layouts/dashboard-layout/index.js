import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import { Notifications } from '../../../api/notifications';

import './dashboard-layout.html';

const texts = {
    en: {
        jobs: 'Jobs',
        msg: 'Messages',
        prof: 'Profile',
        set: 'Settings'
    },
    tc: {
        jobs: '工作',
        msg: '信息',
        prof: '個人資料',
        set: '設定'
    }
}

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('notifications');
}

Template.DashboardLayout.onCreated(function() {
    this.subscribe('notifications');
});

Template.DashboardLayout.helpers({
    texts() {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            return texts.tc;
        return texts.en;
    },
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