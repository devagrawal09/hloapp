import { Email } from 'meteor/email';

import { sendSMS } from '../../sms';

import { Caregivers } from '../../caregivers';
import { Jobs } from '..';
import { Notifications } from '../../notifications';

const root = process.env.ROOT_URL;

Jobs.notifications = {
    newApplication({ caregiverId, jobId }) {
        const caregiver = Caregivers.findOne( caregiverId );
        const job = Jobs.findOne( jobId );
        const customer = Meteor.users.findOne( job.postedBy );        
        const emails = customer.getEmails();
        const Urls = {
            dashboard: ` ${ root }dashboard `,
            caregiver: ` ${ root }caregiver/${ caregiver._id } `
        }
        Notifications.insert({
            user: customer._id,
            type: 'job',
            job: jobId
        });
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `You have received an application for the job ${ job.title }`,
            text: `
                Hi ${ customer.fullName },
                You have received an application for the Job ${ job.title }
                by ${ caregiver.name }!
                You can accept this Caregiver's application from your dashboard.
                Go to dashboard : ${ Urls.dashboard }
                View details for this caregiver : ${ Urls.caregiver }
            `
        });
    },
    offerAccepted({ caregiverId, jobId }) {
        const caregiver = Caregivers.findOne( caregiverId );
        const job = Jobs.findOne( jobId );
        const customer = Meteor.users.findOne( job.postedBy );        
        const emails = customer.getEmails();
        const Urls = {
            dashboard: ` ${ root }dashboard `,
        }
        Notifications.insert({
            user: customer._id,
            type: 'job',
            job: jobId
        });
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `${ caregiver.name } has accepted your offer for the Job ${ job.title }`,
            text: `
                Hi ${ customer.fullName },
                The offer you sent to ${ caregiver.name } for the Job ${ job.title }
                has been accepted!
                Go to dashboard : ${ Urls.dashboard }
            `
        });
    },
    jobCompleted({ jobId }) {
        const job = Jobs.findOne( jobId );
        const customer = Meteor.users.findOne( job.postedBy );
        const emails = customer.getEmails();
        const Urls = {
            dashboard: ` ${ root }dashboard `,
        }
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `Job ${ job.title } completed!`,
            text: `
                Hi ${ customer.fullName },
                Congratulations on completing the Job ${ job.title }!

                Go to dashboard : ${ Urls.dashboard }
            `
        });
    }
}