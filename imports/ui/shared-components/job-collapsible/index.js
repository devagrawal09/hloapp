import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

import SimpleSchema from 'simpl-schema';

import { paymentSchema } from '../../../api/payments/schema.js';

import { Notifications } from '../../../api/notifications';
import { Caregivers, acceptOffer, declineOffer } from '../../../api/caregivers';
import { hireApplicant, completeJpaywJob, repostJob } from '../../../api/jobs';
import { Payments, checkPayment, pay } from '../../../api/payments';

import showAlert from '../alert';

import '../../helpers';
import '../review';
import './review-modal.html';
import './payment-details-modal.html';
import './decline-modal.html';
import './collapsible.html';

const texts = new ReactiveVar({});

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
    this.autorun(()=> {
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

Template.jobCollapsible.helpers({
    texts() {
        return texts.get();
    },
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
    'click .hire'(e, t) {
        hireApplicant.call({
            job: t.data._id,
            applicant: t.$(e.target).attr('id')
        }, (err, res) => {
            if (err) {
                console.error(err);
                showAlert(err.reason, 'danger');
            } else {
                showAlert('Sucessfully hired this caregiver!');
            }
        });
    },
    'click .complete'(e, t) {
        completeJob.call({ _id: t.data._id }, (err, res) => {
            if (err) {
                console.error(err);
                showAlert(err.reason, 'danger');
            } else {
                showAlert(`Sucessfully ${res} this job!`);
            }
        });
    },
    'click .accept'(e, t) {
        acceptOffer.call({ _id: t.data._id }, (err, res) => {
            if (err) {
                console.error(err);
                showAlert(err.reason, 'danger');
            } else {
                showAlert('Sucessfully accepted offer for this job!');
            }
        })
    },
    'click .decline'(e, t) {
        declineOffer.call({ _id: t.data._id }, (err, res) => {
            if (err) {
                console.error(err);
                showAlert(err.reason, 'danger');
            } else {
                showAlert('Sucessfully declined offer for this job!');
            }
        })
    },
    'click .repost'(e, t) {
        console.log({ t });
        repostJob.call({ _id: t.data._id }, ( err, res )=> {
            if ( err ) {
                console.error( err );
                showAlert( err.reason, 'danger');
            } else {
                FlowRouter.go(`/edit/${res}`);
                $('html, body').animate({ scrollTop: 0 }, 'slow');
                showAlert('Sucessfully Reposted! You can edit the new Job details here.');
            }
        });
    }
});

Template.reviewSection.helpers({
    texts() {
        return texts.get();
    }
});

Template.reviewModal.helpers({
    texts() {
        return texts.get();
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
    texts() {
        return texts.get();
    },
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

Template.paymentDetailsModal.onRendered(function() {
    this.autorun(()=> {
        if( Template.PostedJobs.paypalScriptLoaded.get() ) {
            const jobId = this.data._id;
            const paymentDetails = Payments.findOne({ job: jobId });
            console.log({ paymentDetails });
            paypal.Button.render({
                // Configure environment
                env: Meteor.settings.public.paypal.mode,
                client: Meteor.settings.public.paypal.client,
                // Customize button (optional)
                locale: 'en_US',
                style: {
                    size: 'small',
                    color: 'gold',
                    shape: 'pill',
                },
            
                // Enable Pay Now checkout flow (optional)
                commit: true,
            
                // Set up a payment
                payment(data, actions) {
                    return actions.payment.create({
                        transactions: [{
                            amount: {
                                total: paymentDetails.total(),
                                currency: 'HKD'
                            }
                        }]
                    });
                },
                // Execute the payment
                onAuthorize(data, actions) {
                    return actions.payment.execute().then(()=> {
                        // Show a confirmation message to the buyer
                        pay.call({ job: jobId }, ( err, res )=> {
                            if( err ) showAlert( err.reason, 'danger');
                            else showAlert('Payment successfully made!');
                            $('.modal-backdrop').remove();
                        });
                    }).catch(( err )=> {
                        console.error( err );
                        showAlert('Payment could not be executed. Please try again!');
                    });
                }
            }, `#paypal-button-${jobId}`);
        }
    });
});

Template.paymentDetailsModal.helpers({
    texts() {
        return texts.get();
    },
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
