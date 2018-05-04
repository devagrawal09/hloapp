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
        this.subscribe( 'caregiver.images', Meteor.userId() );
    });
});

Template.CaregiverProfile.onRendered(function() {
    this.$( '.carousel .item:first' ).addClass( 'active' );
    this.$( '.carousel-indicators li:first' ).addClass( 'active' );
});

Template.CaregiverProfile.helpers({
    caregiver() {
        return Template.instance().doc;
    },
    profilePhoto() {
        let dpId = Template.instance().doc.profilePhoto;
        return CaregiverImages.findOne( dpId ) || {
            link: '/img/search/dp.jpg',
            name: ''
        };
    },
    photos() {
        return CaregiverImages.find({ meta: { user: Meteor.userId() } });
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
