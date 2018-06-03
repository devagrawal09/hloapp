import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';

import './forms.js';
import './edit-profile.html';

Template.EditProfileCaregiver.onCreated(function () {
    let t = this;
    Template.EditProfileCaregiver.nextTab = t.nextTab = () => {
        t.$('.nav li.active').next('li').children('a').tab('show');
        t.$('.form-steps').get()[0].scrollIntoView(true);
    }
    Template.EditProfileCaregiver.prevTab = t.prevTab = () => {
        t.$('.nav li.active').prev('li').children('a').tab('show');
        t.$('.form-steps').get()[0].scrollIntoView(true);
    }
    t.subscribe('caregiver.current');
});

Template.EditProfileCaregiver.onRendered(function() {
    let hash = window.location.hash;
    if( hash ) {
        this.$(`.nav li a[href="${hash}"]`).tab('show');
        this.$('.form-steps').get()[0].scrollIntoView(true);
    }
});

Template.EditProfileCaregiver.helpers({
    id() {
        return Caregivers.findOne({ user: Meteor.userId() })._id;
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
