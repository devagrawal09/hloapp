import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { Accounts } from 'meteor/accounts-base';

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
    sendVerificationEmail: true,

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

if( Meteor.isServer ) {

    const verifyEmailTemplate = _.template( Assets.getText('verify-email.html') );

    Accounts.emailTemplates.from = 'no-reply@hloapp.herokuapp.com';
    Accounts.emailTemplates.siteName = 'HealthyLovedOnes';

    Accounts.emailTemplates.verifyEmail = {
        subject() {
            return 'Verify your email with HLO'
        },
        html( user, url ) {
            return verifyEmailTemplate({ url });
        }
    }

    ServiceConfiguration.configurations.upsert({
        service: 'facebook'
    }, { $set: {
            appId: Meteor.settings.facebook.appId,
            loginStyle: 'popup',
            secret: Meteor.settings.facebook.secret
        }
    });
}
if( Meteor.isClient ) {
    Accounts.ui.config({
        requestPermissions: {
            facebook: ['id', 'first_name', 'last_name', 'picture', 'email']
        },
        passwordSignupFields: 'USERNAME_AND_EMAIL'
    });
}
