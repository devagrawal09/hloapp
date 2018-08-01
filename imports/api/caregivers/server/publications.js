import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { Caregivers, CaregiverImages } from '../index.js';
import { Jobs, Reviews } from '../../jobs';

Meteor.publishComposite('caregivers', {
    find() {
        return Caregivers.find({
            
        });
    },
    children: [{
        find( caregiver ) {
            return Reviews.find({
                job: { $in: caregiver.jobHistory }
            }, {
                fields: { rating: 1, job: 1 }
            });
        }
    }]
});

Meteor.publishComposite('caregivers.cards', function({ filter = {}, sort, limit }) {

    check( filter, Object );
    check( sort, Object );
    check( limit, Match.Integer );

    if( Meteor.users.findOne( this.userId ).username !== 'admin' )
        filter.isProfileComplete = true;

    return {
        find() {
            return Caregivers.find( filter, { fields: {
                name: 1,
                gender: 1,
                location: 1,
                aboutText: 1,
                hourlyRate: 1,
                jobHistory: 1,
                profilePhoto: 1
            }, sort, limit });
        },
        children: [{
            find( caregiver ) {
                return Reviews.find({
                    job: { $in: caregiver.jobHistory }
                }, {
                    fields: { rating: 1, job: 1 }
                });
            }
        }]
    }
});

Meteor.publishComposite('caregiverById', function( id ) {
    return {
        find() {
            return Caregivers.find( id );
        },
        children: [{
            find( caregiver ) {
                return Meteor.users.find( caregiver.user, {
                    fields: { username: 1 }
                });
            }
        }, {
            find( caregiver ) {
                return CaregiverImages.find({
                    meta: { user: caregiver.user }
                }).cursor
            }
        }, {
            find( caregiver ) {
                return Reviews.find({
                    job: { $in: caregiver.jobHistory }
                });
            },
            children: [{
                find( review ) {
                    return Jobs.find( review.job, {
                        fields: { postedBy: 1 }
                    })
                },
                children: [{
                    find( job ) {
                        return Meteor.users.find( job.postedBy, {
                            fields: { fullName: 1, username: 1, gender: 1, profile: 1 }
                        });
                    }
                }]
            }]
        }]
    }
});

Meteor.publishComposite('caregiversById', function( ids ) {
    return {
        find() {
            return Caregivers.find({
                _id: { $in: ids }
            });
        },
        children: [{
            find( caregiver ) {
                return Meteor.users.find( caregiver.user, {
                    fields: { username: 1 }
                });
            }
        }, {
            find( caregiver ) {
                return Reviews.find({
                    job: { $in: caregiver.jobHistory }
                }, {
                    fields: { rating: 1, job: 1 }
                });
            }
        }]
    }
});

Meteor.publish('caregiverByUser', function( user ) {
    return Caregivers.find({ user });
});

Meteor.publish('caregiver.current', function() {
    return [
        Caregivers.find({ user: this.userId }),
        CaregiverImages.find({
            meta: { user: this.userId }
        }).cursor
    ];
});

Meteor.publish('caregiver.images', function( user ) {
    return CaregiverImages.find({
        meta: { user }
    }).cursor;
});

Meteor.publish('caregiverById.images', function( _id ) {
    let caregiver = Caregivers.findOne( _id );
    return CaregiverImages.find({
        meta: { user: caregiver.user }
    }).cursor;
});

Meteor.publish('caregiver.image', function( _id ) {
    return CaregiverImages.find({ _id }).cursor;
});

Meteor.publishComposite('caregiver.employment', {
    find() {
        return Caregivers.find({
            user: this.userId
        }, { fields: {
            user: 1,
            offers: 1,
            currentJob: 1,
            appliedJobs: 1,
            jobHistory: 1,
            isProfileComplete: 1
        }});
    },
    children: [{
        find( caregiver ) {
            return Jobs.find({ $or: [
                { _id: caregiver.currentJob, hired: caregiver._id },
                { _id: { $in: caregiver.offers }, offers: caregiver._id },
                { _id: { $in: caregiver.appliedJobs }, applicants: caregiver._id },
                { _id: { $in: caregiver.jobHistory }, hired: caregiver._id }
            ]});
        },
        children: [{
            find( job ) {
                return Reviews.find({ job: job._id });
            }
        }, {
            find( job ) {
                return Meteor.users.find( job.postedBy, {
                    fields: { fullName: 1, username: 1, gender: 1, profile: 1 }
                });
            }
        }]
    }]
});

Meteor.publishComposite('professional', {
    find() {
        return Caregivers.find({
            isProfileComplete: true,
            professional: true
        });
    },
    children: [{
        find( caregiver ) {
            return Reviews.find({
                job: { $in: caregiver.jobHistory }
            }, {
                fields: { rating: 1, job: 1 }
            });
        }
    }]
});
