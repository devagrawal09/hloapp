import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

import { Caregivers } from '../../caregivers';

const welcomeEmailHtml = Assets.getText('welcome-email.html');

Accounts.onCreateUser(function(options, user){          //create new caregivers

    let first = options.profile.firstName,
        last = options.profile.lastName;

    if( options.profile.type === 'caregiver') {
        Caregivers.insert({
            user: user._id,
            firstName: first,
            lastName: last,
            name: `${first} ${last}`,
            isProfileComplete: false,
            jobHistory: []
        });
    };

    user.firstName = first;
    user.lastName = last;
    user.fullName = `${first} ${last}`;
    user.profile = options.profile;

    Email.send({ 
        from: 'info@healthylovedones.com', 
        to: user.emails[0].address,
        replyTo: 'info@healthylovedones.com',
        subject: 'Welcome to HealthyLovedOnes',
        html: welcomeEmailHtml
    });

    return user;
});