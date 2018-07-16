import { Meteor } from 'meteor/meteor';

export default {
    loggedIn( userId ) {
        if( !userId )
            throw new Meteor.Error('user.unauthorized',
            'You are not logged in!');
    },
    isCurrent( current, user ) {
        if ( current !== user ) {
            //if current user doesn't match received profile user
            throw new Meteor.Error('user.unauthorized',
            'Invalid input, please try again');
        }
    },
    isVerified( userId ) {
        if( !Meteor.users.findOne( userId ).isVerified() )
            throw new Meteor.Error('user.unverified',
            'You need to have atleast one verified email address for this action!');
    },
    isCustomer( userId ) {
        if( Meteor.users.findOne( userId ).profile.type === 'caregiver' )
            //current user is not a customer
            throw new Meteor.Error('user.unauthorized',
            'You are not registered customer!');
    },
    isAdmin( userId ) {
        if( Meteor.users.findOne( userId ).username !== 'admin' )
            throw new Meteor.Error('admin.unauthorized', 
            'This is an administrative action!');
    }
}
