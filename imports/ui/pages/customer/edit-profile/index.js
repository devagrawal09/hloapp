import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { userProfileSchema } from '../../../../api/users';

import './edit-profile.html';

Template.EditProfileCustomer.helpers({
    profileSchema() {
        return userProfileSchema;
    },
    profileDoc() {
        return Meteor.users.findOne( Meteor.userId(), {
            fields: {
                firstName: 1,
                lastName: 1,
                fullName: 1,
                gender: 1,
                phone: 1,
                address: 1,
                district: 1,
                otherDistrict: 1,
                country: 1
            }
        });
    }
});
