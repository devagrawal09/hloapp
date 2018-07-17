import { Email } from 'meteor/email';

import { sendSMS } from '../../sms';

import { Caregivers } from '..';
import { Jobs } from '../../jobs';
import { Notifications } from '../../notifications';

const root = process.env.ROOT_URL;

const emails = {
    finalise: 'profile completed',
    newOffer: 'job offer',
    offerExpired: 'offer expired',
    appAccepted: 'application accepted',
    appNotAccepted: 'application denied',
    jobCompleted: 'job completed',
    reviewed: 'review',
    paid: 'payment received'
}

const EmailNotifs = Object.keys( emails ).reduce( ( notifs, key )=> {
    notifs[key] = _.template( Assets.getText(`email/${ emails[key] }.html`) );
}, {});

Caregivers.notifications = {
    finalise({ userId }) {
        const caregiver = Caregivers.findOne({ user: userId });
        const emails = Meteor.users.findOne( userId ).getEmails();
        const Urls = {
            dashboard: ` ${ root }dashboard `,
            jobs: ` ${ root }jobs `
        }
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: 'Profile submitted',
            html: EmailNotifs.finalise({ caregiver, Urls })
        });
    },
    newOffer({ caregiverId, jobId }) {
        const caregiver = Caregivers.findOne( caregiverId );
        const job = Jobs.findOne( jobId );
        const customer = Meteor.users.findOne( job.postedBy );
        const emails = Meteor.users.findOne( caregiver.user ).getEmails();
        const Urls = {
            dashboard: ` ${ root }dashboard `,
            job: ` ${ root }job/${ job._id } `
        }
        Notifications.insert({
            user: caregiver.user,
            type: 'job',
            job: jobId
        });
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `You have been offered the Job - ${ job.title }`,
            html: EmailNotifs.newOffer({ caregiver, job, customer, Urls })
        });
    },
    offerExpired({ caregiverId, jobId }) {
        const caregiver = Caregivers.findOne( caregiverId );
        const job = Jobs.findOne( jobId );
        const customer = Meteor.users.findOne( job.postedBy );
        const emails = Meteor.users.findOne( caregiver.user ).getEmails();
        const Urls = {
            dashboard: ` ${ root }dashboard `,
            jobs: ` ${ root }jobs `
        }
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `Your offer for the job "${ job.title }" has expired!`,
            html: EmailNotifs.offerExpired({ caregiver, job, customer, Urls })
        });
    },
    appAccepted({ caregiverId, jobId }) {
        const caregiver = Caregivers.findOne( caregiverId );
        const job = Jobs.findOne( jobId );
        const customer = Meteor.users.findOne( job.postedBy );
        const emails = Meteor.users.findOne( caregiver.user ).getEmails();
        const Urls = {
            dashboard: ` ${ root }dashboard `,
            job: ` ${ root }job/${ job._id } `
        }
        Notifications.insert({
            user: caregiver.user,
            type: 'job',
            job: jobId
        });
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `Your application for the Job "${ job.title }" has been accepted!`,
            html: EmailNotifs.appAccepted({ customer, job, caregiver, Urls })
        });
    },
    appNotAccepted({ caregiverId, jobId }) {
        const caregiver = Caregivers.findOne( caregiverId );
        const job = Jobs.findOne( jobId );
        const customer = Meteor.users.findOne( job.postedBy );
        const emails = Meteor.users.findOne( caregiver.user ).getEmails();
        const Urls = {
            dashboard: ` ${ root }dashboard `,
            jobs: ` ${ root }jobs `
        }
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `Your application for the job "${ job.title }" has been rejected!`,
            html: EmailNotifs.appNotAccepted({ caregiver, job, customer, Urls })
        });
    },
    jobCompleted({ jobId }) {
        const job = Jobs.findOne( jobId );
        const caregiver = Caregivers.findOne( job.hired );
        const customer = Meteor.users.findOne( job.postedBy );
        const emails = Meteor.users.findOne( caregiver.user ).getEmails();
        const Urls = {
            dashboard: ` ${ root }dashboard `
        }
        Notifications.insert({
            user: caregiver.user,
            type: 'job',
            job: jobId
        });
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `The Job "${ job.title }" is complete!`,
            html: EmailNotifs.jobCompleted({ caregiver, job, customer, Urls })
        });
    },
    reviewed({ jobId }) {
        const job = Jobs.findOne( jobId );
        const caregiver = Caregivers.findOne( job.hired );
        const customer = Meteor.users.findOne( job.postedBy );
        const emails = Meteor.users.findOne( caregiver.user ).getEmails();
        const Urls = {
            dashboard: ` ${ root }dashboard `
        }
        Notifications.insert({
            user: caregiver.user,
            type: 'job',
            job: jobId
        });
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `You have received a review for the Job "${ job.title }"!`,
            html: EmailNotifs.reviewed({ caregiver, job, customer, Urls })
        });
    },
    paid({ jobId }) {
        const job = Jobs.findOne( jobId );
        const caregiver = Caregivers.findOne( job.hired );
        const customer = Meteor.users.findOne( job.postedBy );
        const emails = Meteor.users.findOne( caregiver.user ).getEmails();
        Notifications.insert({
            user: caregiver.user,
            type: 'job',
            job: jobId
        });
        Notifications.insert({
            user: job.postedBy,
            type: 'job',
            job: jobId
        });
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `You have received payment for the job "${ job.title }"!`,
            html: EmailNotifs.paid({ caregiver, job, customer })
        });
    }
}