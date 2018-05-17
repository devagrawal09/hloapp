import { Template } from 'meteor/templating';

import { Jobs } from '../../../../api/jobs';

import '../../../shared-components/job-collapsible';
import './posted-jobs.html';

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('jobs');
    Package['msavin:mongol'].Mongol.showCollection('job-images');
}

Template.PostedJobs.onCreated(function() {
    let t = this;
    t.autorun(()=> {
        t.subscribe( 'myJobs' );
    });
});

Template.PostedJobs.helpers({
    jobs() {
        return Jobs.find({ status: 'open' });
    },
    ongoingJobs() {
        return Jobs.find({ status: 'hired' });
    },
    completedJobs() {
        return Jobs.find({ status: 'completed' });
    },
    expiredJobs() {
        return Jobs.find({ status: 'expired' });
    }
});
