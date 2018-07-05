import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import paypal from 'paypal-rest-sdk';
import SimpleSchema from 'simpl-schema';

import Datatypes from '../data-types';
import newInvoice from './templates.js';

import { paymentSchema } from './schema.js';

import { Jobs } from '../jobs';
import { Caregivers } from '../caregivers';
import { ADDRGETNETWORKPARAMS } from 'dns';

const createInvoiceFiber = Meteor.wrapAsync( paypal.invoice.create, paypal.invoice );
const sendInvoiceFiber = Meteor.wrapAsync( paypal.invoice.send, paypal.invoice );
const getInvoiceFiber = Meteor.wrapAsync( paypal.invoice.get, paypal.invoice );
const cancelInvoiceFiber = Meteor.wrapAsync( paypal.invoice.cancel, paypal.invoice );

export const Payments = new Mongo.Collection('payments');

export const newPayment = new ValidatedMethod({     //caregiver submits payment info
    name: 'payments.new',
    validate: paymentSchema.pick('job', 'hours', 'hourlyRate', 'extraCharges').validator(),
    run( payment ) {

        if( !this.userId || (Meteor.users.findOne( this.userId ).profile.type !== 'caregiver') ) {
            //not a registered caregiver
            throw new Meteor.Error('payments.new.unauthorized', 
            'You are not a registered caregiver');
        }

        const caregiver = Caregivers.findOne({ user: this.userId });

        const job = Jobs.findOne({
            _id: payment.job,
            status: 'completed',
            hired: caregiver._id
        });

        if( !job ) {
            //job id error
            throw new Meteor.Error('payments.new.error', 
            'This job is either incomplete or does not exist!');
        }

        const existing = Payments.findOne({ job: job._id });

        if( existing ) {
            //payment already initiated
            throw new Meteor.Error('payments.new.exists', 
            'Payment for this job has already been initiated!');
        }

        if( !this.isSimulation ) {

            const invoiceTemplate = newInvoice({
                hours: payment.hours,
                rate: payment.hourlyRate,
                extra: payment.extraCharges,
                customerEmails: job.user().emails.map( obj=> ({ email: obj.address }) ),
                jobTitle: job.title,
                caregiverName: caregiver.name
            });
            console.log( invoiceTemplate )

            try {
                const invoice = createInvoiceFiber( invoiceTemplate );

                sendInvoiceFiber( invoice.id );
    
                payment.status = 'sent';
                payment.invoice = invoice.id;
        
                Payments.insert( payment );
            }
            catch( err ) {
                console.error( err );
                console.log( JSON.stringify( err ) );
                throw err;
            }
        }

        return true;
    }
});

export const checkPayment = new ValidatedMethod({   //check status of payment both
    name: 'payments.check',
    validate: paymentSchema.pick('job').validator(),
    run( obj ) {

        if( !this.userId ) {
            //current user is not a customer
            throw new Meteor.Error('payments.check.unauthorized',
            'You are not logged in!');
        }

        //fetch job details
        const job = Jobs.findOne({
            _id: obj.job,
            status: 'completed'
        });

        const payment = Payments.findOne({ job: obj.job });

        if( !job || !payment ) {
            //invalid input
            throw new Meteor.Error('payments.check.error',
            'Invalid Input, please try again!');
        }

        if( job.postedBy !== this.userId ) {
            //current user is not the owner of the job
            let caregiver = Caregivers.findOne({ user: this.userId });

            if( job.hired !== caregiver._id ) {
                //current user is not the hired caregiver for this job
                throw new Meteor.Error('payments.check.unauthorized', 
                'You are not associated with this job!');
            }
        }

        if( !this.isSimulation ) {

            let result = '', newStatus = '';
            
            try {
                const invoice = getInvoiceFiber( payment.invoice );
                switch ( invoice.status ) {
                    case 'SENT':
                        newStatus = 'sent';
                        result = 'Payment details submitted by the Caregiver';
                        break;
                    case 'PAID':
                    case 'MARKED_AS_PAID':
                        newStatus = 'paid';
                        result = 'Payment has been recieved by HLO!';
                        if( !this.isSimulation ) Caregivers.notifications.paid({ jobId: job._id });
                        break;
                    case 'CANCELLED':
                        newStatus = 'declined';
                        result = 'Payment has been declined by Customer!';
                        break;
                    default:
                        result = 'Please contact HLO for details!';
                        break;
                }
                console.log( payment, newStatus );
                if( payment.status !== newStatus ) {
                    Payments.update( payment._id, { $set: { status: newStatus } });
                }
            }
            catch( err ) {
                console.error( err );
                console.log( JSON.stringify( err ) );
                throw err;
            }

            return result;
        }
    }
});

export const declinePayment = new ValidatedMethod({ //customer declines payment
    name: 'payments.decline',
    validate: new SimpleSchema({
        id: Datatypes.Id,
        reason: {
            type: String, optional: true
        }
    }).validator(),
    run({ id, reason }) {

        if( !this.userId || Meteor.users.findOne( this.userId ).profile.type === 'caregiver' ) {
            //current user is not a customer
            throw new Meteor.Error('payments.decline.unauthorized',
            'You are not registered customer!');
        }

        //fetch job details
        const job = Jobs.findOne({
            _id: id,
            postedBy: this.userId,
            status: 'completed'
        });

        const payment = Payments.findOne({ job: id });

        if( !job || !payment ) {
            //invalid input
            throw new Meteor.Error('payments.decline.error',
            'Invalid Input, please try again!');
        }

        if( !this.isSimulation ) {

            const options = {
                'subject': 'Declined by Customer',
                'note': `Canceling invoice because - ${reason}`,
                'send_to_merchant': true,
                'send_to_payer': true
            }

            try {
                cancelInvoiceFiber( payment.invoice, options );

                Payments.update( payment._id, {
                    $set: { status: 'declined' }
                });
            }
            catch( err ) {
                console.error( err );
                console.log( JSON.stringify( err ) );
                throw err;
            }
        }
    }
});

Payments.helpers({
    total() {
        let total = 0, hours = this.hours, rate = this.hourlyRate, extra = this.extraCharges;
        if( extra ) total = ( hours * rate ) + extra;
        else total = hours * rate;
        return total;
    }
});
