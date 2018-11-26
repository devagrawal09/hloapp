if( Meteor.isCordova ) {
    require('../../mobile');
} else {
    require('../../config/client');
    require('../../config');
    require('./routes.js');
}
