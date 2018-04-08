import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';

Meteor.users.deny({
    update() { return true; }
});

AccountsTemplates.configure({
    privacyUrl: '/privacy',
    termsUrl: '/terms',
    onLogoutHook() {
        FlowRouter.go('logged-out');
    }
});

AccountsTemplates.addField({
    _id: 'type',
    type: 'select',
    select: [{
        text: 'Customer',
        value: 'customer'
    }, {
        text: 'Caregiver',
        value: 'caregiver'
    }]
});