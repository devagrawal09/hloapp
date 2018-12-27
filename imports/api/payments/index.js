import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import SimpleSchema from 'simpl-schema';

import Datatypes from '../data-types';

import { paymentSchema } from './schema.js';

import { Jobs } from '../jobs';
import { Caregivers } from '../caregivers';

import userChecks from '../users/checks';
import caregiverChecks from '../caregivers/checks';

export const Payments = new Mongo.Collection('payments');

export const newPayment = new ValidatedMethod({     //caregiver submits payment info
    name: 'payments.new',
    validate: paymentSchema.pick('job', 'hours', 'hourlyRate', 'extraCharges').validator(),
    run( payment ) {

        userChecks.loggedIn( this.userId );
        caregiverChecks.isCaregiver( this.userId );

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

        payment.status = 'sent';

        Payments.insert( payment );

        return true;
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
        
        Payments.update( payment._id, {
            $set: { status: 'declined', reason }
        });
    }
});

export const pay = new ValidatedMethod({            //customer pays through paypal
    name: 'payments.pay',
    validate: paymentSchema.pick('job').validator(),
    run( obj ) {

        userChecks.loggedIn( this.userId );        

        //fetch job details
        const job = Jobs.findOne({
            _id: obj.job,
            postedBy: this.userId,
            status: 'completed'
        });

        const payment = Payments.findOne({ job: obj.job, status: 'sent' });

        if( !job || !payment ) {
            //invalid input
            throw new Meteor.Error('payments.pay.error',
            'Invalid Input, please try again!');
        }

        if( !this.isSimulation ) {
            Payments.update( payment._id, { $set: { status: 'paid' } });
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
