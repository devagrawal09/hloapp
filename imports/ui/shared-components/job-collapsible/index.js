import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';

import SimpleSchema from 'simpl-schema';

import { paymentSchema } from '../../../api/payments/schema.js';

import { Notifications } from '../../../api/notifications';
import { Caregivers, acceptOffer, declineOffer } from '../../../api/caregivers';
import { hireApplicant, completeJob, review, viewJob } from '../../../api/jobs';
import { Payments, checkPayment } from '../../../api/payments';

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

Template.jobCollapsible.onRendered(function() {
    const _id = this.data._id;
    $(`#${ _id }`).on('shown.bs.collapse', ()=> {
        viewJob.call({ _id });
    });
    checkPayment.call({ job: _id });
});

Template.jobCollapsible.helpers({
    rightImageSrc() {
        return this.dp().link();
    },
    notifications() {
        return Notifications.find({
            type: 'job',
            job: this._id,
            user: Meteor.userId()
        }).count();
    },
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
    paymentStatus() {
        const status = Payments.findOne({ job: this._id }).status;
        return {
            isSent: status === 'sent',
            isPaid: status === 'paid',
            isReceived: status === 'received',
            isDeclined: status === 'declined'
        }
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
                showAlert( err.reason, 'danger');
            } else {
                showAlert('Sucessfully hired this caregiver!');
            }
        });
    },
    'click .complete'( e, t ) {
        completeJob.call({ _id: t.data._id }, ( err, res )=> {
            if( err ) {
                console.error( err );
                showAlert( err.reason, 'danger');
            } else {
                showAlert(`Sucessfully ${res} this job!`);
            }
        });
    },
    'click .accept'( e, t ) {
        acceptOffer.call({ _id: t.data._id }, ( err, res )=> {
            if( err ) {
                console.error( err );
                showAlert( err.reason, 'danger');
            } else {
                showAlert('Sucessfully accepted offer for this job!');
            }
        })
    },
    'click .decline'( e, t ) {
        declineOffer.call({ _id: t.data._id }, ( err, res )=> {
            if( err ) {
                console.error( err );
                showAlert( err.reason, 'danger');
            } else {
                showAlert('Sucessfully declined offer for this job!');
            }
        })
    }
});

Template.reviewModal.events({
    'submit #reviewForm'( e, t ) {

        e.preventDefault();
        e.stopPropagation();

        options = {
            job: t.data._id,
            rating: parseInt( e.target.rating.value ),
            content: e.target.content.value
        };

        review.call( options, ( err )=> {
            if( err ) {
                showAlert( err.reason, 'danger');
            } else {
                showAlert('Review successfully posted!');
            }
            $('.modal-backdrop').remove();
        });
    }
});

Template.declinePaymentModal.helpers({
    schema: new SimpleSchema({
        id: Datatypes.Id,
        reason: {
            type: String, optional: true
        }
    })
});

Template.paymentDetailsModal.onCreated(function() {
    this.checking = new ReactiveVar( false );
});

Template.paymentDetailsModal.helpers({
    schema: paymentSchema.pick('job', 'hours', 'hourlyRate', 'extraCharges'),
    isCaregiver() {
        return Meteor.user().profile.type === 'caregiver';
    },
    charges() {
        const caregiver = Caregivers.findOne({ user: Meteor.userId() });
        return {
            hourly: caregiver.hourlyRate,
            extra: caregiver.extraCharges
        }
    },
    paymentDetails() {
        return Payments.findOne({ job: this._id });
    },
    checking() {
        return Template.instance().checking.get();
    }
});

Template.paymentDetailsModal.events({ 
    'click .check'( e, t ) { 
        t.checking.set( true );
        checkPayment.call({ job: t.data._id }, ( err, res )=> {
            if( err ) {
                showAlert( err.reason, 'danger');
                console.error( err );
            }
            else showAlert( res );
            t.checking.set( false );
            t.$(`#payment-details-${t.data._id}`).modal('hide');
            $('.modal-backdrop').remove();
        });
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
            $('.modal-backdrop').remove();
        }}
    }
});
