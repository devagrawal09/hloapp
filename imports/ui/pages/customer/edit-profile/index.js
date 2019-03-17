import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { 
    userProfileSchema, UserImages, updateProfilePhoto, deletePhoto
} from '../../../../api/users';

import './edit-profile.html';

Template.EditProfileCustomer.onCreated(function() {
    this.photoUpload = new ReactiveVar(false);
});

Template.EditProfileCustomer.onRendered(function() {
    let dpId = Meteor.user().profilePhoto;
    this.$( 'img.profile' ).removeClass( 'profile' );
    this.$( `img#${dpId}` ).addClass( 'profile' ); 
});


Template.EditProfileCustomer.helpers({
    profileSchema() {
        return userProfileSchema;
    },
    profileDoc() {
        return Meteor.users.findOne( Meteor.userId(), {
            fields: {
                firstName: 1,
                lastName: 1,
                fullName: 1,
                gender: 1,
                phone: 1,
                address: 1,
                district: 1,
                otherDistrict: 1,
                country: 1
            }
        });
    },
    photoUpload() {
        return Template.instance().photoUpload.get();
    },
    photos() {
        return UserImages.find({
            meta: { user: Meteor.userId() }
        });
    }
});

Template.EditProfileCustomer.events({
    'change #photo'( e, t ) {

        if (e.currentTarget.files && e.currentTarget.files[0]) {

            const upload = UserImages.insert({
                file: e.currentTarget.files[0],
                streams: 'dynamic',
                chunkSize: 'dynamic',
                meta: {
                    user: Meteor.userId()
                }
            }, false);

            upload.on('start', function() {
                t.photoUpload.set(this);
            });

            upload.on('end', function(error, fileObj) {
                if (error) {
                    console.error('Error during upload: ' + error);
                } else {
                    console.log('File "' + fileObj.name + '" successfully uploaded');
                }
                t.photoUpload.set(false);
            });

            upload.start();
        }
    },
    'click .photos img'( e, t ) {

        let $target = t.$( e.target );

        if ( !$target.hasClass('selected') ) {
            
            let $buttons = t.$( '.save-as-dp, .delete' );

            t.$( '.photos img.selected' ).removeClass( 'selected' );

            if( $target.hasClass('profile') ) {
                $buttons.addClass( 'disabled' );
            }
            else {
                $target.addClass( 'selected' );
                $buttons.removeClass( 'disabled' );
            }
        }
    },
    'click .delete'( e, t ) {

        if( !t.$( e.target ).hasClass('disabled') ) {

            let $selected = t.$( '.photos img.selected' );
            let _id = $selected.attr( 'id' );
    
            deletePhoto.call({ _id });
        }
    },
    'click .save-as-dp'( e, t ) {

        if( !t.$( e.target ).hasClass('disabled') ) {

            let $selected = t.$( '.photos img.selected' );
            let _id = $selected.attr( 'id' );
    
            updateProfilePhoto.call({ _id }, ( err, res )=> {
                if( err ) {
                    console.error(err);
                    return;
                }
                t.$( 'img.profile' ).removeClass( 'profile' );
                $selected.removeClass( 'selected' ).addClass( 'profile' );
                t.$( '.save-as-dp, .delete' ).addClass( 'disabled' );
            });
        }
    },
    'click .opt-in'() {
        
    }
});