import { Template } from 'meteor/templating';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import './navbar.html';

Template.Navbar.events({
    'click .logout'() {
        AccountsTemplates.logout();
    }
});
