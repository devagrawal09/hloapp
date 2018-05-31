import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { detailsSchema } from '../../../../api/jobs/schema';
import { newJob } from '../../../../api/jobs';

import '../job-form';
import './post-job.html';

Template.PostJob.onCreated(function() {
    this.subscribe( 'job.new.photos' );
});

Template.PostJob.helpers({
    schema() {
        return detailsSchema.omit( '_id', 'postedBy' );
    }
});

AutoForm.hooks({
    postJob: {
        after: { method( err, result ) {
            if( err ) {
                console.log( err );
            } else {
                FlowRouter.go('dashboard');
            }
        }}
    }
});
