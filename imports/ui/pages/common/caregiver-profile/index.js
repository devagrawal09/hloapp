import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Caregivers, CaregiverImages } from '../../../../api/caregivers';
import { bookmarkCaregiver } from '../../../../api/users';

import './caregiver-profile.html';

Template.CaregiverProfile.onCreated(function() {
    let id = Template.currentData().id();
    this.doc = Caregivers.findOne( id );
    this.autorun(()=> {
        this.subscribe( 'caregiverById', id );
        this.subscribe( 'caregiver.images', this.doc.user );
    });
});

Template.CaregiverProfile.helpers({
    caregiver() {
        return Template.instance().doc;
    },
    activeClass( index ) {
        if( index === 0 ) return 'active';
    },
    notCurrentCaregiver() {
        return Template.instance().doc.user !== Meteor.userId();
    },
    caregiverBackgroundCheck() {
        return !!Template.instance().doc.background;
    },
    isBookmarked() {
        let id = Template.currentData().id();
        let bookmarks = Meteor.user().bookmarks;
        return _.indexOf( bookmarks, id ) !== -1;
    }
});

Template.CaregiverProfile.events({ 
    'click .favorite a'( e, t ) { 
        let id = t.data.id();
        console.log(id);
        bookmarkCaregiver.call({ id });
    } 
});
