import { Template } from 'meteor/templating';

import './review.html';

const fullFlag = '', emptyFlag = '-o', halfFlag = '-half-o';

Template.review.helpers({
    stars() {
        let stars = [];
        let rating = this.rating || 10;

        let fullStars = Math.floor( rating/2 );
        let halfStars = rating % 2;
        let emptyStars = Math.floor( (10-rating)/2 );

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
    }
});
