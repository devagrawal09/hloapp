import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { detailsSchema } from '../../../../api/jobs/schema';
import { Jobs, updateJob } from '../../../../api/jobs';

import '../job-form';
import './edit-job.html';

Template.EditJob.onCreated(function() {
    this.autorun(()=> {
        let id = Template.currentData().id();
        this.subscribe( 'ownJobById', id );
    });
});

Template.EditJob.helpers({
    schema() {
        return detailsSchema;
    },
    doc() {
        let id = Template.currentData().id();
        return Jobs.findOne();
    }
});

AutoForm.hooks({
    editJob: {
        before: { method( doc ) {
            return detailsSchema.clean( doc );
        }},
        after: { method( err ) {
            if( err ) {
                console.log( err );
            } else {
                FlowRouter.go('dashboard');
            }
        }}
    }
});
