import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';

import '../../../shared-components/caregiver-card';
import './bookmarks.html';

const gridDisplay = new ReactiveVar( true );

Template.Bookmarks.onCreated(function() {
    this.autorun(()=> {
        let bookmarks = Meteor.user().bookmarks;        
        this.subscribe('caregiversById', bookmarks );
    });
});

Template.Bookmarks.helpers({
    isGrid() {
        return gridDisplay.get();
    },
    docs() {
        let bookmarks = Meteor.user().bookmarks;
        return Caregivers.find({
            _id: { $in: bookmarks }
        });
    }
});
