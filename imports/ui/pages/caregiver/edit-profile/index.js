import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Caregivers } from '../../../../api/caregivers';

import './forms.js';
import './edit-profile.html';

const texts = new ReactiveVar({});

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
    this.autorun( ()=> {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            import(`./tc.js`).then( i => {
                texts.set( i.texts );
            });
        else
            import(`./en.js`).then( i => {
                texts.set( i.texts );
            });
    });
});

Template.EditProfileCaregiver.onRendered(function() {
    let hash = window.location.hash;
    if( hash ) {
        this.$(`.nav li a[href="${hash}"]`).tab('show');
        this.$('.form-steps').get()[0].scrollIntoView(true);
    }
});

Template.EditProfileCaregiver.helpers({
    texts() {
        return texts.get();
    },
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
