import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { T9n } from 'meteor-accounts-t9n';

import humanize from 'string-humanize';

const fullFlag = '', emptyFlag = '-o', halfFlag = '-half-o';

function stars( rating ) {

    let stars = [];

    const fullStars = Math.floor( rating/2 );
    const halfStars = rating % 2;
    const emptyStars = Math.floor( (10-rating)/2 );

    for( let i=0; i<fullStars; i++ ) {
        stars.push(fullFlag);
    }
    for( let i=0; i<halfStars; i++ ) {
        stars.push(halfFlag);
    }
    for( let i=0; i<emptyStars; i++ ) {
        stars.push(emptyFlag);
    }
    
    return stars;
};

Template.registerHelper( 'isTc', ()=> {
    return Session.equals('lang', 'tc');
});

Template.registerHelper( 'getDate', date=> {
    console.log(date);
    return date.toDateString();
});

Template.registerHelper( 'humanize', string=> {
    return humanize( string );
});

Template.registerHelper( 'hundChars', text=> {
    return text.substr(0, 99) + '...';
});

Template.registerHelper( 'onefiftyChars', text=> {
    return text.substr(0, 149) + '...';
});

Template.registerHelper( 'plusOne', index=> {
    return index + 1;
});

Template.registerHelper( 'stars', rating=> {
    return stars( rating );
});

Template.registerHelper( 't9n', ( x, params )=> T9n.get(x, true, params.hash) );
