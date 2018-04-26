import { Accounts } from 'meteor/accounts-base';

import { Caregivers } from '../../caregivers';

Accounts.onCreateUser(function(options, user){          //create new caregivers
    let first = options.profile.firstName,
        last = options.profile.lastName;
    if( options.profile.type === 'caregiver') {
        Caregivers.insert({
            user: user._id,
            firstName: first,
            lastName: last,
            isProfileComplete: false
        });
    };
    user.firstName = first;
    user.lastName = last;
    user.fullName = `${first} ${last}`;
    user.profile = options.profile;
    return user;
});