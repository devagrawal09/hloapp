import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';

import './forms.js';
import './edit-profile.html';

const texts = {
    en: {
        details: 'Details',
        experience: 'Experience',
        services: 'Services',
        photos: 'Photos',
        pricing: 'Pricing',
        review: 'Review',
        allReq: 'All fields are required',
        starReq: 'Required field'
    },
    tc: {
        details: '詳細資料',
        experience: '經驗',
        services: '服務',
        photos: '照片',
        pricing: '照片',
        review: '預覽',
        allReq: '所有項目均必須填寫',
        starReq: '必須填寫'
    }
}

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
    texts() {
        if( Session.equals('lang', 'tc') )
            return texts.tc;
        return texts.en;
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
