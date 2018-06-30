import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';

import SimpleSchema from 'simpl-schema';

import { paymentSchema } from '../../../api/payments/schema.js';

import { Caregivers, acceptOffer } from '../../../api/caregivers';
import { hireApplicant, completeJob, review, pay, declinePayment } from '../../../api/jobs';
import { Payments, newPayment } from '../../../api/payments';

import showAlert from '../alert';

import '../../helpers';
import '../review';
import './review-modal.html';
import './payment-details-modal.html';
import './decline-modal.html';
import './collapsible.html';

Template.jobCollapsible.onCreated(function() {
    this.autorun(()=> {
        let data = Template.currentData();
        this.subscribe( 'jobs.images', data._id );
        if( data.applicants ) this.subscribe( 'caregiversById', data.applicants );
        if( data.offers ) this.subscribe( 'caregiversById', data.offers );
        if( data.hired ) {
            this.subscribe( 'caregiverById', data.hired );
            this.subscribe( 'caregiverById.images', data.hired );
        }
        this.subscribe( 'job.payment', data._id );
    });
});

Template.jobCollapsible.helpers({
    isOpen() {
        return this.status === 'open';
    },
    isHired() {
        return this.status === 'hired' || this.status === 'completed';
    },
    isCompleted() {
        return this.status === 'completed' || this.status === 'expired';
    },
    isOwnedByCurrentUser() {
        return this.postedBy === Meteor.userId();
    },
    isOfferedToCurrentUser() {
        let caregiver = Caregivers.findOne({ user: Meteor.userId() });
        let job = this;
        let a = _.indexOf( caregiver.offers, job._id ) !== -1;
        let b = _.indexOf( job.offers, caregiver._id ) !== -1;
        return a && b;
    },
    isCurrentCaregiverHired() {
        let caregiver = Caregivers.findOne({ user: Meteor.userId() });
        let job = this;
        return job.hired === caregiver._id;
    },
    isPaid() {
        return this.payment === 'completed';
    },
    rightImageSrc() {
        return this.dp().link();
    },
    paymentDetails() {
        return Payments.findOne({ job: this._id });
    }
});

Template.jobCollapsible.events({ 
    'click .hire'( e, t ) { 
        hireApplicant.call({
            job: t.data._id,
            applicant: t.$(e.target).attr('id')
        }, ( err, res )=> {
            if( err ) {
                console.error( err );
            } else {
                showAlert('Sucessfully hired this caregiver!');
            }
        });
    },
    'click .complete'( e, t ) {
        completeJob.call({ _id: t.data._id }, ( err, res )=> {
            if( err ) {
                console.error( err );
            } else {
                showAlert(`Sucessfully ${res} this job!`);
            }
        });
    },
    'click .accept'( e, t ) {
        acceptOffer.call({ _id: t.data._id }, ( err, res )=> {
            if( err ) {
                console.error( err );
            } else {
                showAlert('Sucessfully accepted offer for this job!');
            }
        })
    },
    'click .pay'( e, t ) {
        //pay caregiver
        pay.call({ _id: t.data._id });
    }
});

Template.reviewModal.events({
    'click .cancel'( e, t ) {
        t.$( '#review-modal' ).modal('hide');
    },
    'submit #reviewForm'( e, t ) {

        e.preventDefault();
        e.stopPropagation();

        options = {
            job: t.data._id,
            rating: parseInt( e.target.rating.value ),
            content: e.target.content.value
        };

        review.call( options, ( err, res )=> {
            if( err ) {
                console.error( err );
            } else {
                showAlert('Review successfully posted!');
            }
        });
    }
});

Template.declinePaymentModal.helpers({
    schema: new SimpleSchema({
        _id: Datatypes.Id,
        reason: {
            type: String, optional: true
        }
    })
});

Template.paymentDetailsModal.helpers({
    schema: paymentSchema.pick('job', 'hours', 'hourlyRate', 'extraCharges'),
    charges() {
        const caregiver = Caregivers.findOne({ user: Meteor.userId() });
        return {
            hourly: caregiver.hourlyRate,
            extra: caregiver.extraCharges
        }
    }
});

AutoForm.hooks({
    paymentDetails: {
        after: { method( err ) {
            if( err ) {
                showAlert( err.reason, 'danger');
            } else {
                showAlert('Invoice sent to the Customer!');
            }
        }}
    }
});
