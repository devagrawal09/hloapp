import { Template } from 'meteor/templating';

import { profileSchema } from '../../../../api/caregivers/schema';

import './edit-profile.html';

Template.EditProfileCaregiver.helpers({
    profileSchema() {
        return profileSchema;
    }
})
