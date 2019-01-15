import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { ServiceConfiguration } from 'meteor/service-configuration';

AccountsTemplates.configure({
    sendVerificationEmail: true,
    overrideLoginErrors: false,
    privacyUrl: '/privacy',
    termsUrl: '/terms',
    onLogoutHook() {
        FlowRouter.go('logged-out');
    },
    texts: {
        errors: {
            loginForbidden: "error.accounts.Login forbidden",
        }
    }
});

Meteor.users.deny({
    update() { return true; }
});

const pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');

AccountsTemplates.addField({
    _id: 'type',
    type: 'radio',
    required: true,
    displayName: '',
    select: [{
        text: 'Customer',
        value: 'customer'
    }, {
        text: 'Caregiver',
        value: 'caregiver'
    }]
});
AccountsTemplates.addFields([
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: 'email',
      placeholder: 'email',
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
  {
      _id: 'username',
      type: 'text',
      displayName: 'username',
      placeholder: 'username',
      required: true,
      minLength: 5,
  },
  pwd
]);
AccountsTemplates.addField({
    _id: 'firstName',
    type: 'text',
    required: true
});
AccountsTemplates.addField({
    _id: 'lastName',
    type: 'text',
    required: true
});

if( Meteor.isServer ) {

    const verifyEmailTemplate = _.template( Assets.getText('emails/email verification.html') );

    Accounts.emailTemplates.from = 'no-reply@healthylovedones.com';
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
    ServiceConfiguration.configurations.upsert({
        service: 'linkedin'
    }, { $set: {
            clientId: Meteor.settings.linkedin.id,
            loginStyle: 'popup',
            secret: Meteor.settings.linkedin.secret
        }
    });
}
if( Meteor.isClient ) {
    Accounts.ui.config({
        requestPermissions: {
            facebook: ['public_profile', 'email'],
            linkedin: ['r_basicprofile', 'r_emailaddress']
        }
    });
}
