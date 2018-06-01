import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './forms.js';
import './edit-profile.html';

Template.EditProfileCaregiver.onCreated(function () {
    this.subscribe('caregiver.current');
    let t = this;
    Template.EditProfileCaregiver.nextTab = t.nextTab = () => {
        t.$('.nav li.active').next('li').children('a').tab('show');
        t.$('.form-steps').get()[0].scrollIntoView(true);
    }
    Template.EditProfileCaregiver.prevTab = t.prevTab = () => {
        t.$('.nav li.active').prev('li').children('a').tab('show');
        t.$('.form-steps').get()[0].scrollIntoView(true);
    }
});

Template.EditProfileCaregiver.events({
    'click .next'(e, t) {
        t.nextTab();
    },
    'click .back'(e, t) {
        t.prevTab();
    }
});
