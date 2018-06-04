import { Template } from "meteor/templating";

import '../../../api/users';
import SimpleSchema from 'simpl-schema';

Template.pickTypeForm.helpers({
    schema: new SimpleSchema({
        type: {
            type: String,
            label: 'Who do you want to be?',
            allowedValues: ['customer', 'caregiver']
        }
    })
});
