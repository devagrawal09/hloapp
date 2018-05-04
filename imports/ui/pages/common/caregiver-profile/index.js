import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Caregivers, CaregiverImages } from '../../../../api/caregivers';
import { bookmarkCaregiver } from '../../../../api/users';

import './caregiver-profile.html';

Template.CaregiverProfile.onCreated(function() {
    let id = Template.currentData().id();
    let dpId = Caregivers.findOne( id ).profilePhoto;
    this.dpId = new ReactiveVar( dpId );
    this.autorun(()=> {
        this.subscribe( 'caregiverById', id );
        this.subscribe( 'caregiver.image', dpId );
    });
});

Template.CaregiverProfile.helpers({
    caregiver() {
        let id = Template.currentData().id();
        return Caregivers.findOne( id );
    },
    profilePhoto() {
        let id = Template.currentData().id();
        let dpId = Template.instance().dpId.get();
        return CaregiverImages.findOne( dpId );
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
