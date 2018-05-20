import { Template } from 'meteor/templating';

import './review.html';

Template.review.helpers({
    stars() {
        const fullFlag = '', emptyFlag = '-o', halfFlag = '-half-o';
        let stars = [];
        let fullStars = 3;
        let halfStars = 1;
        let emptyStars = 1;
        for( let i=0; i<fullStars; i++ ) {
            stars.push(fullFlag);
        }
        for( let i=0; i<halfStars; i++ ) {
            stars.push(halfFlag);
        }
        for( let i=0; i<emptyStars; i++ ) {
            stars.push(emptyFlag);
        }
        //mutate result according to data here
        return stars;
    }
});
