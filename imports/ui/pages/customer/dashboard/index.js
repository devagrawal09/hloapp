import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Jobs } from '../../../../api/jobs';
import { Caregivers } from '../../../../api/caregivers';

import showAlert from '../../../shared-components/alert';

import '../../../shared-components/loading';
import '../../../shared-components/job-collapsible';
import '../../../shared-components/compose-modal';
import '../../../shared-components/caregiver-card';
import './posted-jobs.html';

const texts = {
    en: {
        listed: 'Listed Jobs',
        add: 'Add Job',
        noList: 'No jobs currently listed.',
        ongoing: 'Ongoing Jobs',
        completed: 'Completed Jobs',
        expired: 'Expired Jobs',
        fav: {
            head: 'Favorite Caregivers',
            empty: 'No Favorite Caregivers!',
            all: 'View All'
        }
    },
    tc: {
        listed: '已刊登的招聘',
        add: '新增招聘',
        noList: '目前沒有職位列出.',
        ongoing: '進行中的工作',
        completed: '已完成的工作',
        expired: '過期的工作',
        fav: {
            head: '喜愛的護理員',
            empty: '沒有最喜歡的看護人!',
            all: '查看全部'
        }
    }
}

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('jobs');
    Package['msavin:mongol'].Mongol.showCollection('job-images');
    Package['msavin:mongol'].Mongol.showCollection('payments');
}

Template.PostedJobs.onCreated(function() {
    this.subscribe( 'myJobs' );
    this.msgRecipient = new ReactiveVar('');
    this.autorun(()=> {
        let bookmarks = Meteor.user().bookmarks;        
        this.subscribe('caregiversById', bookmarks );
    });
});

Template.PostedJobs.helpers({
    texts() {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            return texts.tc;
        return texts.en;
    },
    jobs() {
        return Jobs.find({ status: 'open' }, {
            sort: { postedOn: -1 }
        });
    },
    ongoingJobs() {
        return Jobs.find({ status: 'hired' }, {
            sort: { postedOn: -1 }
        });
    },
    completedJobs() {
        return Jobs.find({ status: 'completed' }, {
            sort: { postedOn: -1 }
        });
    },
    expiredJobs() {
        return Jobs.find({ status: 'expired' }, {
            sort: { postedOn: -1 }
        });
    },
    msgDoc() {
        const recipient = Template.instance().msgRecipient.get();
        return { recipient };
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

Template.PostedJobs.events({ 
    'click .message'( e, t ) { 
        let recipient = t.$(e.target).data('recipient');
        t.msgRecipient.set( recipient );
        t.$('#compose').modal('show');
    },
    'click .new-job'() {
        if( Meteor.user().isVerified() )
            FlowRouter.go('jobs.new');
        else
            showAlert('You need to have atleast one verified email address for this action!', 'danger');
    }
});
