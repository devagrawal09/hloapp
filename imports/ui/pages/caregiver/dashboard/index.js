import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';
import { Jobs } from '../../../../api/jobs';

import './job-history.html';
import '../../../shared-components/caregiver-card';
import '../../../shared-components/job-collapsible';

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('caregivers');
}

Template.JobHistory.onCreated(function () {
    let t = this;
    t.subscribe('caregiver.employment', () => {
        t.caregiver = Caregivers.find({
            user: Meteor.userId()
        }, {
            fields: {
                offers: 1,
                currentJob: 1,
                appliedJobs: 1,
                jobHistory: 1
            }
        });
    });
    this.autorun(()=> {
        let bookmarks = Meteor.user().bookmarks;        
        this.subscribe('caregiversById', bookmarks );
    });
});

Template.JobHistory.helpers({
    employment() {
        return Template.instance().caregiver.fetch()[0];
    },
    jobOffers() {
        let caregiver = Template.instance().caregiver.fetch()[0];
        return Jobs.find({
            _id: { $in: caregiver.offers },
            offers: caregiver._id
        });
    },
    currentJob() {
        let caregiver = Template.instance().caregiver.fetch()[0];
        return Jobs.findOne({
            _id: caregiver.currentJob,
            hired: caregiver._id
        });
    },
    appliedJobs() {
        let caregiver = Template.instance().caregiver.fetch()[0];
        return Jobs.find({
            _id: { $in: caregiver.appliedJobs },
            applicants: caregiver._id
        });
    },
    jobHistory() {
        let caregiver = Template.instance().caregiver.fetch()[0];
        return Jobs.find({
            _id: { $in: caregiver.jobHistory },
            hired: caregiver._id
        });
    },
    favorites() {
        let bookmarks = Meteor.user().bookmarks;
        if( bookmarks.length > 4 ) {
            bookmarks = bookmarks.slice(0,4);
        }
        return Caregivers.find({
            _id: { $in: bookmarks }
        });
    }
});
