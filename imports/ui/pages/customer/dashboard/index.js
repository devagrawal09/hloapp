import { Template } from 'meteor/templating';

import { Jobs } from '../../../../api/jobs';

import '../../../shared-components/job-collapsible';
import '../../../shared-components/compose-modal';
import './posted-jobs.html';
import { ReactiveVar } from 'meteor/reactive-var';

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('jobs');
    Package['msavin:mongol'].Mongol.showCollection('job-images');
}

Template.PostedJobs.onCreated(function() {
    this.subscribe( 'myJobs' );
    this.msgRecipient = new ReactiveVar('');
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
    }
});

Template.PostedJobs.events({ 
    'click .message'( e, t ) { 
        let recipient = t.$(e.target).data('recipient');
        t.msgRecipient.set( recipient );
        t.$('#compose').modal('show');
    } 
});
