import { Template } from 'meteor/templating';

import humanize from 'string-humanize';

Template.registerHelper( 'getDate', ( date )=> {
    console.log(date);
    return date.toDateString();
});

Template.registerHelper( 'humanize', ( string )=> {
    return humanize( string );
});
