import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { caregiverSchema } from '../../../../api/caregivers/schema.js';
import { Caregivers, CaregiverImages, updateProfilePhoto, deletePhoto } from '../../../../api/caregivers';

//import templates
    import '../../../shared-components/checkbox-columns';
    import './details-form.html';
    import './experience-form.html';
    import './services-form.html';
    import './photos-form.html';
    import './pricing-form.html';
    import './review.html';
    import './submit-buttons.html';
    import './edit-profile.html';

Template.EditProfileCaregiver.onCreated(function() {
    let t = this;
    t.autorun(()=> {
        t.subscribe( 'caregiver.current' );
        t.subscribe( 'caregiver.images' );
    });
});

Template.EditProfileCaregiver.helpers({
    caregiverSchema() {
        return caregiverSchema;
    },
    caregiverDoc() {
        return Caregivers.findOne({
            user: Meteor.userId()
        });
    }
});

Template.EditProfileCaregiver.events({
    'click .next'( e, t ) {
        t.$( '.nav li.active' ).next( 'li' ).children( 'a' ).tab( 'show' );
    },
    'click .back'( e, t ) {
        t.$( '.nav li.active' ).prev( 'li' ).children( 'a' ).tab( 'show' );
    }
});

//photos form
    Template.caregiverPhotosForm.onCreated(function() {
        this.photoUpload = new ReactiveVar(false);
    });

    Template.caregiverPhotosForm.onRendered(function() {
        let dpId = Caregivers.findOne({
            user: Meteor.userId()
        }).profilePhoto;
        this.$( 'img.profile' ).removeClass( 'profile' );
        this.$( `img#${dpId}` ).addClass( 'profile' );
    });

    Template.caregiverPhotosForm.helpers({
        photoUpload() {
            return Template.instance().photoUpload.get();
        },
        photos() {
            return CaregiverImages.find();
        }
    });

    Template.caregiverPhotosForm.events({
        'change #photo'( e, t ) {

            if (e.currentTarget.files && e.currentTarget.files[0]) {

                const upload = CaregiverImages.insert({
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
                        alert('Error during upload: ' + error);
                    } else {
                        alert('File "' + fileObj.name + '" successfully uploaded');
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

            if( !e.target.hasClass('disabled') ) {

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
        }
    });

//pricing form
    Template.caregiverPricingForm.helpers({
        options() {
            return {
                Free: 'Free plan - $0/mo, 10% commission',
                Entrepreneur: 'Entrepreneur Plan - 88$/mo, 5% commission',
                Partner: 'Partner Plan - 888$/mo, 10% commission'
            }
        }
    });

//review page
    Template.caregiverProfileReview.helpers({
        profilePhoto() {
            let dpId = Caregivers.findOne({
                user: Meteor.userId()
            }).profilePhoto;
            return CaregiverImages.findOne( dpId );
        }
    });
