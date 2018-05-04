import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';

Meteor.users.deny({
    update() { return true; }
});

AccountsTemplates.configure({
    homeRoutePath: '/dashboard',
    privacyUrl: '/privacy',
    termsUrl: '/terms',
    onLogoutHook() {
        FlowRouter.go('logged-out');
    },
    postSignUpHook( userId, info ) {
        console.log( info )
    }
});

AccountsTemplates.addField({
    _id: 'firstName',
    type: 'text',
    required: true,
    displayName: 'First name',
    placeholder: 'First name'
});
AccountsTemplates.addField({
    _id: 'lastName',
    type: 'text',
    required: true,
    displayName: 'Last name',
    placeholder: 'Last name'
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
