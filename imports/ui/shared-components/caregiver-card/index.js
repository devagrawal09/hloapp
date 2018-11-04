import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var'

import { bookmarkCaregiver } from '../../../api/users';

import { recipient } from '../../pages/common/search';

import './card.html';

const locTc = new ReactiveVar({});

Template.caregiverCard.onCreated(function() {
    let dpId = this.data.profilePhoto;
    this.subscribe('caregiver.image', dpId );
    this.autorun(()=> {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            import(`../../../api/data-types/tc.js`).then( i => {
                locTc.set( i.default.locations );
            });
    });
});

Template.caregiverCard.helpers({
    isBookmarked() {
        let id = this._id;
        let bookmarks = Meteor.user().bookmarks;
        return _.indexOf( bookmarks, id ) !== -1;
    },
    getLocation() {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            return locTc.get()[ this.location ];
        return this.location;
    },
    currency() {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            return '港幣/小時';
        return 'HKD/hr';
    }
});

Template.caregiverCard.events({
    'click .fav'( e, t ) {
        let id = t.data._id;
        bookmarkCaregiver.call({ id });
    },
    'click .msg'( e, t ) {
        const username = Meteor.users.findOne( t.data.user ).username;
        recipient.set( username );
        $('#compose').modal();
    }
});
