import { Template } from 'meteor/templating';

import { profileSchema, experienceSchema, servicesSchema, imagesSchema, pricingSchema } from '../../../../api/caregivers/schema.js';
import { Caregivers, updateProfile, updateExperiences, updateServices } from '../../../../api/caregivers';

import './details-form.html';
import './experience-form.html';
import './services-form.html';
import './photos-form.html';
import './pricing-form.html';

console.log( Caregivers );

//details form
    Template.detailsForm.onCreated(function() {
        let t = this;
        t.autorun(()=> {
            t.subscribe( 'caregiver.profile' );
        });
    });

    Template.detailsForm.helpers({
        profileSchema() {
            return profileSchema;
        },
        profileDoc() {
            return Caregivers.findOne({
                user: Meteor.userId()
            }, { fields: {
                user: 1,
                firstName: 1,
                lastName: 1,
                gender: 1,
                dob: 1,
                aboutText: 1,
                address: 1,
                district: 1,
                country: 1,
                religion: 1,
                hobbies: 1,
                workLocation: 1,
                languages: 1
            }});
        }
    });

//experience form
    Template.experienceForm.onCreated(function() {
        let t = this;
        t.autorun(()=> {
            t.subscribe( 'caregiver.experiences' );
        });
    });

    Template.experienceForm.helpers({
        experienceSchema() {
            return experienceSchema;
        },
        experienceDoc() {
            return Caregivers.find({
                user: Meteor.userId()
            }, { fields: {
                user: 1,
                years: 1,
                experiences: 1,
                background: 1,
                education: 1
            }});
        }
    });

//services form
    Template.servicesForm.onCreated(function() {
        let t = this;
        t.autorun(()=> {
            t.subscribe( 'caregiver.services' );
        });
    });

    Template.servicesForm.helpers({
        servicesSchema() {
            return servicesSchema;
        },
        servicesDoc() {
            return Caregivers.find({
                user: Meteor.userId()
            }, { fields: {
                hourlyRate: 1,
                extraCharges: 1,
                ownsCar: 1,
                availableDays: 1,
                availableTimeStart: 1,
                availableTimeEnd: 1,
                caregiverType: 1,
                professionalServices: 1,
                personalServices: 1,
                medicalExpertise: 1
            }});
        }
    });

//photos form
Template.photosForm.helpers({
    photosSchema() {
        return imagesSchema;
    }
});

Template.pricingForm.helpers({
    pricingSchema() {
        return pricingSchema;
    },
    options() {
        return {
            Free: 'Free plan - $0/mo',
            Entrepreneur: 'Entrepreneur Plan - 88$/mo',
            Partner: 'Partner Plan - 888$/mo'
        }
    }
})
