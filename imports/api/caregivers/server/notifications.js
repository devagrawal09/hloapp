import { Email } from 'meteor/email';

import { sendSMS } from '../../sms';

import { Caregivers } from '..';
import { Jobs } from '../../jobs';
import { Notifications } from '../../notifications';

const root = process.env.ROOT_URL;

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
            text: `
                Hi ${ caregiver.name },
                You have successfully completed and submitted your Caregiver profile!
                Now you can apply to Jobs and receive Job offers on HealthyLovedOnes.
                Thank You for registering with us!
                Go to dashboard : ${ Urls.dashboard }
                Start searching for jobs : ${ Urls.jobs }
            `
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
            text: `
                Hi ${ caregiver.name },
                You have been offered the Job ${ job.title } which was posted by
                ${ customer.fullName }!
                Accept this offer from your dashboard : ${ Urls.dashboard }
                View details for this job here : ${ Urls.job }
            `
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
            text: `
                Hi ${ caregiver.name },
                You were offered the Job ${ job.title } which was posted by
                ${ customer.fullName }.
                Unfortunately, this Job offer is no longer valid because
                either the Customer has hired someone else for the Job, or
                the Job is no longer needed by the Customer.
                Go to dashboard : ${ Urls.dashboard }
                Search for more jobs : ${ Urls.jobs }
            `
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
            text: `
                Hi ${ caregiver.name },
                Your application for the job "${ job.title }" which was posted by
                ${ customer.fullName } has been accepted!
                Congratulations for you latest employment!
                Go to Dashboard : ${ Urls.dashboard }
                View details for this Job : ${ Urls.job }
            `
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
            text: `
                Hi ${ caregiver.name },
                Your application for the job ${ job.title } which was posted by
                ${ customer.fullName } has been rejected!
                Either the Customer has hired another Caregiver for this Job,
                or this Job is no longer needed by the Customer.
                We hope you get an employment more suited to you the next time!
                Go to dashboard : ${ Urls.dashboard }
                Search for more jobs : ${ Urls.jobs }
            `
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
            text: `
                Hi ${ caregiver.name },
                Congratulations on completing the job "${ job.title }"
                which was posted by ${ customer.fullName }!
                Now you can submit the details of the payment that the Customer
                owes you form your Dashboard! Please make sure you submit the details
                as soon as possible.
                Go to Dashboard : ${ Urls.dashboard }
            `
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
            text: `
                Hi ${ caregiver.name },
                Congratulations on completing the job "${ job.title }"
                which was posted by ${ customer.fullName }.
                The Customer has submitted a review for the Job!
                You can see the review from your Dashboard!
                Go to Dashboard : ${ Urls.dashboard }
            `
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
            text: `
                Hi ${ caregiver.name },
                Congratulations on completing the job "${ job.title }"
                which was posted by ${ customer.fullName }.
                The Customer has made a payment according to the details you submitted.
                The payment has been received by us, and we will forward it to you
                within 3 business days.
            `
        });
    }
}