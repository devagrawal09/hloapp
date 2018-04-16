import { Accounts } from 'meteor/accounts-base';

import { Caregivers } from '../../caregivers';

Accounts.onCreateUser(function(options, user){          //create new caregivers
    if( options.profile.type === 'caregiver') {
        Caregivers.insert({
            user: user._id
        });
    };
    user.fullName = options.profile.fullName;
    user.profile = options.profile;
    return user;
});