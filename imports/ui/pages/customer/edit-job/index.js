import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

import humanize from 'string-humanize';

import { detailsSchema } from '../../../../api/jobs/schema';
import { Jobs, updateJob } from '../../../../api/jobs';

import showAlert from '../../../shared-components/alert';

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
            const newDoc = detailsSchema.omit( '_id', 'postedBy' ).clean( doc );
            this.validationContext.validate( newDoc );
            if( this.validationContext.isValid() ) return newDoc;
            const errorField = humanize( this.validationContext.validationErrors()[0].name );
            const errorMsg = `${ errorField } is required!`;
            showAlert( errorMsg, 'danger');
            return false;
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
