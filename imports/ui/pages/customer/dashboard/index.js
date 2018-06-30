import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Jobs } from '../../../../api/jobs';
import { Caregivers } from '../../../../api/caregivers';

import '../../../shared-components/loading';
import '../../../shared-components/job-collapsible';
import '../../../shared-components/compose-modal';
import '../../../shared-components/caregiver-card';
import './posted-jobs.html';

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
    } 
});
