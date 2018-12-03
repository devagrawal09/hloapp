import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { JobImages, setDp, deletePhoto } from '../../../../api/jobs';

import TcData from '../../../../api/data-types/tc';

import showAlert from '../../../shared-components/alert';

import '../../../shared-components/checkbox-columns';
import './details-form.html';
import './requirements-form.html';
import './photos-form.html';
import './review.html';
import './job-form.html';

import '../../common/job-details';

const texts = new ReactiveVar({});

const enOpts = ()=> {
    return Object.keys( TcData ).reduce( ( obj, key )=> {
        obj[key] = 'allowed';
        return obj;
    }, {});
}

Template.jobForm.onCreated(function() {
    
    let job = 'new';
    let doc = this.data.doc;
    if( doc ) job = doc._id;

    this.subscribe( 'jobs.images', job );

    this.autorun( ()=> {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            import(`./tc.js`).then( i => {
                texts.set( i.texts );
            });
        else
            import(`./en.js`).then( i => {
                texts.set( i.texts );
            });
    });
});

Template.jobForm.onRendered(function() {
    let hash = window.location.hash;
    if( hash ) {
        this.$(`.nav li a[href="${hash}"]`).tab('show');
        this.$('.form-steps').get()[0].scrollIntoView(true);
    }
});

Template.jobForm.helpers({
    isEditForm( id ) {
        return id === 'editJob';
    },
    texts() {
        return texts.get();
    },
    options() {
        if( Session.equals('lang', 'tc') )
            return TcData;
        return enOpts();
    }
});

Template.jobForm.events({
    'click .next'( e, t ) {
        t.$( '.nav li.active' ).next( 'li' ).children( 'a' ).tab( 'show' );
        t.$('.form-steps').get()[0].scrollIntoView( true );
    },
    'click .back'( e, t ) {
        t.$( '.nav li.active' ).prev( 'li' ).children( 'a' ).tab( 'show' );
        t.$('.form-steps').get()[0].scrollIntoView( true );
    }
});

Template.jobPhotosForm.onCreated(function() {
    this.photoUpload = new ReactiveVar(false);
});

Template.jobPhotosForm.helpers({
    photoUpload() {
        return Template.instance().photoUpload.get();
    },
    photos() {
        let doc = this.doc;
        let job = 'new';
        if( doc ) job = doc._id;

        let meta = { job };
        if( job === 'new' ) meta.user = Meteor.userId();

        return JobImages.find({ meta });
    }
});

Template.jobPhotosForm.events({
    'change #photo'( e, t ) {

        let job = 'new';
        let doc = t.data.doc
        if( doc ) job = doc._id;

        let meta = { job };
        if( job === 'new' ) meta.user = Meteor.userId();
        console.log( meta );

        if (e.currentTarget.files && e.currentTarget.files[0]) {

            const upload = JobImages.insert({
                file: e.currentTarget.files[0],
                streams: 'dynamic',
                chunkSize: 'dynamic',
                meta
            }, false);

            upload.on('start', function() {
                t.photoUpload.set(this);
            });

            upload.on('end', function(error, fileObj) {
                if (error) {
                    console.error('Error during upload: ' + error);
                } else {
                    showAlert('File successfully uploaded!');
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
            
            let job = 'new';
            let doc = t.data.doc
            if( doc ) job = doc._id;
            console.log( job );

            let $selected = t.$( '.photos img.selected' );
            let _id = $selected.attr( 'id' );
    
            deletePhoto.call({ _id, job });
        }
    },
    'click .save-as-dp'( e, t ) {

        if( !t.$( e.target ).hasClass('disabled') ) {

            let job = 'new';
            let doc = t.data.doc
            if( doc ) job = doc._id;
            console.log( job );

            let $selected = t.$( '.photos img.selected' );
            let _id = $selected.attr( 'id' );
    
            setDp.call({ _id, job }, ( err, res )=> {
                if( err ) {
                    console.error(err);
                    return;
                }
            });
        }
    }
});

Template.jobPostReview.helpers({
    dp() {
        let doc = this.doc;
        let job = 'new';
        if( doc ) job = doc._id;

        let meta = { job };
        if( job === 'new' ) meta.user = Meteor.userId();

        return JobImages.findOne({
            meta,
            profile: true
        }) || {
            link: '/img/search/job-ad.png',
            name: 'job-ad-profile'
        };
    }
});
