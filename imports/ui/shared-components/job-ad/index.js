import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './ad.html';

Template.jobAd.onCreated(function() {
    this.autorun(()=> {
        let user = Template.currentData().postedBy;
        this.subscribe( 'user.name', user );
    });
});

Template.jobAd.helpers({
    username() {
        let user = this.postedBy;
        return Meteor.users.findOne( user ).fullName;
    }
});
