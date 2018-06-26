import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './list.html';

Template.jobList.onCreated(function() {
    this.autorun(()=> {
        let user = Template.currentData().postedBy;
        this.subscribe( 'user.name', user );
    });
});

Template.jobList.helpers({
    username() {
        let user = this.postedBy;
        return Meteor.users.findOne( user ).fullName;
    }
});
