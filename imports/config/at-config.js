import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';

Meteor.users.deny({
    update() { return true; }
});

const pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: 'email',
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
  {
      _id: 'username',
      type: 'text',
      displayName: 'username',
      required: true,
      minLength: 5,
  },
  pwd
]);

AccountsTemplates.configure({
    privacyUrl: '/privacy',
    termsUrl: '/terms',
    onLogoutHook() {
        FlowRouter.go('logged-out');
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
