import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './forms.js';
import './edit-profile.html';

Template.EditProfileCaregiver.onCreated(function () {
    this.subscribe('caregiver.current');
});

Template.EditProfileCaregiver.events({
    'click .next'(e, t) {
        t.$('.nav li.active').next('li').children('a').tab('show');
    },
    'click .back'(e, t) {
        t.$('.nav li.active').prev('li').children('a').tab('show');
    }
});
