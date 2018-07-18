import { Email } from 'meteor/email';

import { sendSMS } from '../../sms';

import { Caregivers } from '../../caregivers';
import { Jobs } from '..';
import { Notifications } from '../../notifications';

const root = process.env.ROOT_URL;

const emails = {
    newApplication: 'job applicant',
    offerAccepted: 'offer accepted'
}

const EmailNotifs = Object.keys( emails ).reduce( ( notifs, key )=> {
    notifs[key] = _.template( Assets.getText(`emails/${ emails[key] }.html`) );
}, {});

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
            html: EmailNotifs.newApplication({ customer, job, caregiver, Urls })
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
            html: EmailNotifs.offerAccepted({ customer, job, caregiver, Urls })            
        });
    }
}