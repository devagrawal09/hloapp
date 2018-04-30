import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { caregiverSchema } from '../../../../api/caregivers/schema.js';
import { Caregivers } from '../../../../api/caregivers';

import '../../../shared-components/checkbox-columns';
import './details-form.html';
import './experience-form.html';
import './services-form.html';
import './photos-form.html';
import './pricing-form.html';
import './submit-buttons.html';
import './review.html';

import './edit-profile.html';

Template.EditProfileCaregiver.onCreated(function() {
    let t = this;
    t.autorun(()=> {
        t.subscribe( 'caregiver.current' );
    });
});

Template.EditProfileCaregiver.helpers({
    caregiverSchema() {
        return caregiverSchema;
    },
    caregiverDoc() {
        return Caregivers.findOne({
            user: Meteor.userId()
        });
    }
});

Template.EditProfileCaregiver.events({
    'click .next'( e, t ) {
        t.$( '.nav li.active' ).next( 'li' ).children( 'a' ).tab( 'show' );
    },
    'click .back'( e, t ) {
        t.$( '.nav li.active' ).prev( 'li' ).children( 'a' ).tab( 'show' );
    }
});

Template.caregiverPricingForm.helpers({
    options() {
        return {
            Free: 'Free plan - $0/mo, 10% commission',
            Entrepreneur: 'Entrepreneur Plan - 88$/mo, 5% commission',
            Partner: 'Partner Plan - 888$/mo, 10% commission'
        }
    }
});
