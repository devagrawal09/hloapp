import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

import humanize from 'string-humanize';

import { detailsSchema } from '../../../../api/jobs/schema';
import { newJob } from '../../../../api/jobs';

import showAlert from '../../../shared-components/alert';

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
