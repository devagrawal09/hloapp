import { Template } from "meteor/templating";
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../../../api/users';
import SimpleSchema from 'simpl-schema';

import showAlert from '../../shared-components/alert';
import './pick-type.html';

Template.pickTypeForm.helpers({
    schema: new SimpleSchema({
        type: {
            type: String,
            label: 'Who do you want to be?',
            allowedValues: ['customer', 'caregiver']
        }
    })
});

AutoForm.hooks({
    'pick-type': { after: { method( err, res ) {
        if( err ) showAlert( err.reason, 'danger');
        else FlowRouter.go('dashboard');
    }}}
})
