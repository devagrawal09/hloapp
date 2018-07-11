import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';

import '../../../shared-components/caregiver-card';
import '../../../shared-components/caregiver-list';
import './bookmarks.html';

const gridDisplay = new ReactiveVar( true );
const Sort = new ReactiveVar({ name: 1 });

Template.Bookmarks.onCreated(function() {
    this.autorun(()=> {
        let bookmarks = Meteor.user().bookmarks;        
        this.subscribe('caregiversById', bookmarks );
    });
});

Template.Bookmarks.helpers({
    sortKeys: ['name', 'hourlyRate'],
    isGrid() {
        return gridDisplay.get();
    },
    docs() {
        let bookmarks = Meteor.user().bookmarks;
        let sort = Sort.get();

        return Caregivers.find({
            _id: { $in: bookmarks }
        }, { sort });
    }
});

Template.Bookmarks.events({ 
    'click .grid-toggle'() { gridDisplay.set( true ); },
    'click .list-toggle'() { gridDisplay.set( false ); },

});

Template.sortButtonF.helpers({
    arrowDir() {
        const order = Sort.get()[this.key];
        if( order === 1 ) return 'down';
        if( order === -1 ) return 'up';
    }
});

Template.sortButtonF.events({
    'click .btn'( e , t ) {
        const key = t.data.key;
        const currentSort = Sort.get();
        const newSort = {};
        if( currentSort[key] === 1 ) newSort[key] = -1;
        else newSort[key] = 1;
        Sort.set(newSort);
    }
});
