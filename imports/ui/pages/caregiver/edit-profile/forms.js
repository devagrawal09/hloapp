import { Template } from 'meteor/templating';

import { AutoForm } from 'meteor/aldeed:autoform';

import { profileSchema, experienceSchema, servicesSchema, imagesSchema, pricingSchema } from '../../../../api/caregivers/schema.js';
import { Caregivers, updateProfile, updateExperiences, updateServices } from '../../../../api/caregivers';

import './details-form.html';
import './experience-form.html';
import './services-form.html';
import './photos-form.html';
import './pricing-form.html';

//details form
    Template.caregiverDetailsForm.onCreated(function() {
        let t = this;
        t.autorun(()=> {
            t.subscribe( 'caregiver.profile' );
        });
    });

    Template.caregiverDetailsForm.helpers({
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
    Template.caregiverExperienceForm.onCreated(function() {
        let t = this;
        t.autorun(()=> {
            t.subscribe( 'caregiver.experiences' );
        });
    });

    Template.caregiverExperienceForm.helpers({
        experienceSchema() {
            return experienceSchema;
        },
        experienceDoc() {
            return Caregivers.findOne({
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
    Template.caregiverServicesForm.onCreated(function() {
        let t = this;
        t.autorun(()=> {
            t.subscribe( 'caregiver.services' );
        });
    });

    Template.caregiverServicesForm.helpers({
        servicesSchema() {
            return servicesSchema;
        },
        servicesDoc() {
            return Caregivers.findOne({
                user: Meteor.userId()
            }, { fields: {
                user: 1,
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
    Template.caregiverPhotosForm.helpers({
        photosSchema() {
            return imagesSchema;
        }
    });

//pricing form
    Template.caregiverPricingForm.onCreated(function() {
        let t = this;
        t.autorun(()=> {
            t.subscribe('caregiver.plan');
        });
    });

    Template.caregiverPricingForm.helpers({
        pricingSchema() {
            return pricingSchema;
        },
        pricingDoc() {
            return Caregivers.findOne({
                user: Meteor.userId()
            }, { fields: {
                user: 1,
                plan: 1,
            }});
        },
        options() {
            return {
                Free: 'Free plan - $0/mo',
                Entrepreneur: 'Entrepreneur Plan - 88$/mo',
                Partner: 'Partner Plan - 888$/mo'
            }
        }
    });
