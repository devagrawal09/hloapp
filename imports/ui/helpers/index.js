import { Template } from 'meteor/templating';

Template.registerHelper( 'getDate', ( date )=> {
    return date.toDateString();
});
