import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { AutoForm } from 'meteor/aldeed:autoform';

import { detailsSchema, experienceSchema, servicesSchema, pricingSchema } from '../../../../api/caregivers/schema.js';
import { 
    Caregivers,
    CaregiverImages,
    updateCaregiverDetails,
    updateCaregiverExp,
    updateCaregiverServices,
    updateCaregiverPlan,
    updateProfilePhoto,
    deletePhoto
} from '../../../../api/caregivers';

import TcData from '../../../../api/data-types/tc';

import showAlert from '../../../shared-components/alert';

import '../../../shared-components/checkbox-columns';
import './details-form.html';
import './experience-form.html';
import './services-form.html';
import './photos-form.html';
import './pricing-form.html';
import './submit-buttons.html';

const options = new ReactiveVar({});

const enOpts = ()=> {
    return Object.keys( TcData ).reduce( ( obj, key )=> {
        obj[key] = 'allowed';
        return obj;
    }, {});
}

//details form
    Template.caregiverDetailsForm.helpers({
        schema: detailsSchema,
        doc() {
            return Caregivers.findOne({
                user: Meteor.userId()
            });
        },
        options() {
            if( Session.equals('lang', 'tc') )
                return TcData;
            return enOpts();
        }
    });

//experience form
    Template.caregiverExperienceForm.helpers({
        schema: experienceSchema,
        doc() {
            return Caregivers.findOne({
                user: Meteor.userId()
            });
        }
    });

//services form
    Template.caregiverServicesForm.helpers({
        schema: servicesSchema,
        doc() {
            return Caregivers.findOne({
                user: Meteor.userId()
            });
        },
        options() {
            if( Session.equals('lang', 'tc') )
                return TcData;
            return enOpts();
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
            return CaregiverImages.find({
                meta: { user: Meteor.userId() }
            });
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
        }
    });

//pricing form
    Template.caregiverPricingForm.helpers({
        schema: pricingSchema,
        options() {
            if( Session.equals('lang', 'tc') )
                return {
                    Free: '免費計劃－港幣＄0 /月，15％佣金',
                    Entrepreneur: '企業家計劃－港幣＄88 /月，10％佣金',
                    Partner: '合作夥伴計劃－港幣＄888/月，10％佣金'
                };

            return {
                Free: 'Free plan - $0/mo, 15% commission',
                Entrepreneur: 'Entrepreneur Plan - 88$/mo, 10% commission',
                Partner: 'Partner Plan - 888$/mo, 10% commission'
            };
        },
        doc() {
            return Caregivers.findOne({
                user: Meteor.userId()
            });
        }
    });

//submit buttons
    Template.submitButtons.helpers({
        id() {
            return Caregivers.findOne({
                user: Meteor.userId()
            })._id;
        }
    });

//hooks
    AutoForm.addHooks(['editDetails', 'editExperiences', 'editServices', 'editPricing'], {
        after: { method( err, res ) {
            if( err ) {
                showAlert( err.reason, 'danger');
            } else {
                Template.EditProfileCaregiver.nextTab();
                showAlert( `${res} saved successfully!` );
            }
        }}
    });
