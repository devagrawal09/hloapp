import { Template } from 'meteor/templating';

import { bookmarkCaregiver } from '../../../api/users';

import { recipient } from '../../pages/common/search';

import './card.html';

Template.caregiverCard.onCreated(function() {
    let dpId = this.data.profilePhoto;
    this.subscribe('caregiver.image', dpId );
});

Template.caregiverCard.helpers({
    isBookmarked() {
        console.log( this );
        let id = this._id;
        let bookmarks = Meteor.user().bookmarks;
        return _.indexOf( bookmarks, id ) !== -1;
    },
});

Template.caregiverCard.events({
    'click .fav'( e, t ) {
        let id = t.data._id;
        bookmarkCaregiver.call({ id });
    },
    'click .msg'( e, t ) {
        console.log( t.data );
        const username = Meteor.users.findOne( t.data.user ).username;
        recipient.set( username );
        $('#compose').modal();
    }
});
