import { Template } from 'meteor/templating';

import '../../../shared-components/checkbox-columns';
import './details-form.html';
import './requirements-form.html';
import './photos-form.html';
import './review.html';
import './job-form.html';

Template.jobForm.helpers({
    isEditForm( id ) {
        return id === 'editJob';
    }
});

Template.jobForm.events({
    'click .next'( e, t ) {
        t.$( '.nav li.active' ).next( 'li' ).children( 'a' ).tab( 'show' );
    },
    'click .back'( e, t ) {
        t.$( '.nav li.active' ).prev( 'li' ).children( 'a' ).tab( 'show' );
    }
}); 
