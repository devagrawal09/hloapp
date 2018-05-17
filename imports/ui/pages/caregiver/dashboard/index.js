import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';
import { Jobs } from '../../../../api/jobs';

import './job-history.html';
import '../../../shared-components/job-collapsible';

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('caregivers');
}

Template.JobHistory.onCreated(function() {
    let t = this;
    t.autorun(()=> {
        t.subscribe('caregiver.employment', ()=> {
            t.caregiver = Caregivers.findOne({
                user: Meteor.userId()
            }, { fields: {
                currentJob: 1,
                appliedJobs: 1,
                jobHistory: 1,
            }});
            if( t.caregiver.offers ) t.subscribe( 'caregiver.offers' );
            if( t.caregiver.currentJob ) t.subscribe( 'caregiver.currentJob' );
            if( t.caregiver.appliedJobs ) t.subscribe( 'caregiver.appliedJobs' );
            if( t.caregiver.jobHistory ) t.subscribe( 'caregiver.jobHistory' );
        });
    });
});

Template.JobHistory.helpers({
    employment() {
        return Template.instance().caregiver;
    },
    jobOffers() {
        let caregiver = Template.instance().caregiver;
        return Jobs.find({
            _id: { $in: caregiver.offers },
            offers: caregiver._id
        });
    },
    currentJob() {
        let caregiver = Template.instance().caregiver;
        return Jobs.find({
            _id: caregiver.currentJob,
            hired: caregiver._id
        });
    },
    appliedJobs() {
        let caregiver = Template.instance().caregiver;
        return Jobs.find({
            _id: { $in: caregiver.appliedJobs },
            applicants: caregiver._id
        });
    },
    jobHistory() {
        let caregiver = Template.instance().caregiver;
        return Jobs.find({
            _id: { $in: caregiver.jobHistory },
            hired: caregiver._id
        });
    }
});
