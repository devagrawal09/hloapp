import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';
import { Jobs } from '../../../../api/jobs';

import './job-history.html';
import '../../../shared-components/caregiver-card';
import '../../../shared-components/job-collapsible';

const texts = {
    en: {
        offers: 'Job Offers',
        history: 'Job History',
        current: 'Current Job',
        applied: 'Applied Jobs',
        completed: 'Completed Jobs',
        fav: {
            head: 'Favorite Caregivers',
            empty: 'No Favorite Caregivers!',
            all: 'View All'
        }
    },
    tc: {
        offers: '獲邀聘的工作',
        history: '工作紀錄',
        current: '目前的工作',
        applied: '已申請的工作',
        completed: '已完成的工作',
        fav: {
            head: '喜愛的護理員',
            empty: '沒有最喜歡的看護人!',
            all: '查看全部'
        }
    }
}

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('caregivers');
    Package['msavin:mongol'].Mongol.showCollection('payments');
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
        const bookmarks = Meteor.user().bookmarks;        
        if( bookmarks ) this.subscribe('caregiversById', bookmarks );
    });
});

Template.JobHistory.helpers({
    texts() {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            return texts.tc;
        return texts.en;
    },
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
