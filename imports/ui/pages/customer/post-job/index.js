import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { detailsSchema } from '../../../../api/jobs/schema';
import { newJob } from '../../../../api/jobs';

import './details-form.html';
import './requirements-form.html';
import './photos-form.html';
import './review.html';
import './post-job.html';

Template.PostJob.helpers({
    jobSchema() {
        return detailsSchema.omit( '_id', 'postedBy' );
    }
});

Template.PostJob.events({
    'click .next'( e, t ) {
        t.$( '.nav li.active' ).next( 'li' ).children( 'a' ).tab( 'show' );
    },
    'click .back'( e, t ) {
        t.$( '.nav li.active' ).prev( 'li' ).children( 'a' ).tab( 'show' );
    }
});

