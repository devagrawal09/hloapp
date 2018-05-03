import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { caregiverSchema } from '../../../../api/caregivers/schema.js';
import { Caregivers, CaregiverImages } from '../../../../api/caregivers';

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

Template.caregiverPhotosForm.onCreated(function() {
    this.photoUpload = new ReactiveVar(false);
    this.autorun(()=> {
        this.subscribe('caregiver.images');
    });
});

Template.caregiverPhotosForm.helpers({
    photoUpload() {
        return Template.instance().photoUpload.get();
    },
    photo() {
        return CaregiverImages.findOne();
    }
});

Template.caregiverPhotosForm.events({
    'change #photo'( e, t ) {

        if (e.currentTarget.files && e.currentTarget.files[0]) {

            const upload = CaregiverImages.insert({
                file: e.currentTarget.files[0],
                streams: 'dynamic',
                chunkSize: 'dynamic',
                meta: {
                    user: Meteor.userId()
                }
            }, false);

            upload.on('start', function() {
                t.photoUpload.set(this);
            });

            upload.on('end', function(error, fileObj) {
                if (error) {
                    alert('Error during upload: ' + error);
                } else {
                    alert('File "' + fileObj.name + '" successfully uploaded');
                }
                t.photoUpload.set(false);
            });

            upload.start();
        }
    },
    'click .photos img'( e, t ) { 
        t.$( '.photos img.selected' ).removeClass( 'selected' );
        t.$( e.target ).addClass( 'selected' );
        t.$( '.save-as-dp' ).attr({ disabled: false });
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
