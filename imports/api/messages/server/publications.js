import { Meteor } from 'meteor/meteor';

import { Messages, Conversations } from '..';
import { Caregivers, CaregiverImages } from '../../caregivers';

Meteor.publishComposite('conversations', {
    find() {
        return Conversations.find({
            participants: this.userId
        });
    },
    children: [{
        find( conversation ) {
            return Messages.find({
                conversation: conversation._id,
                $or: [{ to: this.userId }, { from: this.userId }]
            }, {
                sort: { sent: -1 },
                limit: 1
            });
        }
    }, {
        find( conversation ) {
            return Meteor.users.find({
                _id: { $in: conversation.participants }
            }, { fields: {
                fullName: 1, username: 1, gender: 1, profile: 1
            }});
        },
        children: [{
            find( user ) {
                return Caregivers.find({ user: user._id }, {
                    fields: { user: 1, profilePhoto: 1 }
                });
            },
            children: [{
                find( caregiver ) {
                    return CaregiverImages.find({
                        _id: caregiver.profilePhoto,
                        meta: { user: caregiver.user }
                    }).cursor;
                }
            }]
        }]
    }]
});

Meteor.publishComposite('conversation', function( _id, limit ){
    return {
        find() {
            return Conversations.find({
                _id,
                participants: this.userId
            });
        },
        children: [{
            find( conversation ) {
                return Messages.find({
                    conversation: conversation._id,
                    $or: [{ to: this.userId }, { from: this.userId }]
                }, {
                    sort: { sent: -1 },
                    limit
                });
            }
        }, {
            find( conversation ) {
                return Meteor.users.find({
                    _id: { $in: conversation.participants }
                }, { fields: {
                    fullName: 1, username: 1, gender: 1, profile: 1
                }});
            },
            children: [{
                find( user ) {
                    return Caregivers.find({ user: user._id }, {
                        fields: { user: 1, profilePhoto: 1 }
                    });
                },
                children: [{
                    find( caregiver ) {
                        return CaregiverImages.find({
                            _id: caregiver.profilePhoto,
                            meta: { user: caregiver.user }
                        }).cursor;
                    }
                }]
            }]
        }]
    }
});
