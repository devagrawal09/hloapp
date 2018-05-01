import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';
import { bookmarkCaregiver } from '../../../../api/users';

import './caregiver-profile.html';

Template.CaregiverProfile.onCreated(function() {
    let id = Template.currentData().id();
    this.autorun(()=> {
        this.subscribe('caregiverById', id);
    });
});

Template.CaregiverProfile.helpers({
    caregiver() {
        let id = Template.currentData().id();
        return Caregivers.findOne( id );
    },
    caregiverBackgroundCheck() {
        let id = Template.currentData().id();
        return !!Caregivers.findOne( id ).background;
    },
    isBookmarked() {
        let id = Template.currentData().id();
        return _.indexOf( Meteor.user().bookmarks, id ) !== -1;
    }
});

Template.CaregiverProfile.events({ 
    'click .favorite a'( e, t ) { 
        let id = t.data.id();
        console.log(id);
        bookmarkCaregiver.call({ id });
    } 
});
