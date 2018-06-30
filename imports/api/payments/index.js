import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import paypal from 'paypal-rest-sdk';
import newInvoice from './templates.js';

import { paymentSchema } from './schema.js';

import { Jobs } from '../jobs';
import { Caregivers } from '../caregivers';

const createInvoiceFiber = Meteor.wrapAsync( paypal.invoice.create, paypal.invoice );
const sendInvoiceFiber = Meteor.wrapAsync( paypal.invoice.send, paypal.invoice );

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

Payments.helpers({
    total() {
        let total = 0, hours = this.hours, rate = this.hourlyRate, extra = this.extraCharges;
        if( extra ) total = ( hours * rate ) + extra;
        else total = hours * rate;
        return total;
    }
});
