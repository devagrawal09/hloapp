import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Caregivers } from '../../../../api/caregivers';
import { Jobs, hireApplicant, offerJob } from '../../../../api/jobs';
import { bookmarkCaregiver } from '../../../../api/users';

import TCdata from '../../../../api/data-types/tc.js';

import showAlert from '../../../shared-components/alert';

import '../../../helpers';
import '../../../shared-components/admin-buttons';
import '../../../shared-components/compose-modal';
import '../../../shared-components/review';
import './hire-caregiver.html';
import './caregiver-profile.html';

const texts = new ReactiveVar({});

Template.CaregiverProfile.onCreated(function() {
    let id = Template.currentData().id();
    this.subscribe( 'caregiverById', id, ()=> {
        document.title = Caregivers.findOne( id ).name;
    });
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

Template.CaregiverProfile.helpers({
    texts() {
        return texts.get();
    },
    isAdmin() {
        return Meteor.user().username === 'admin';
    },
    caregiver() {
        let caregiver = Caregivers.findOne( this.id );
        if( Session.equals('lang', 'tc') ) {
            caregiver.location = TCdata.locations[ caregiver.location ];
            caregiver.workLocation = caregiver.workLocation.map( loc=> TCdata.locations[ loc ] );
            caregiver.religion = TCdata.religions[ caregiver.religion ];

            caregiver.languages = caregiver.languages.map( lang=> TCdata.languages[ lang ] );
            caregiver.caregiverType = caregiver.caregiverType.map( type=> TCdata.careTypes[ type ] );
            caregiver.professionalServices = caregiver.professionalServices.map( service=> TCdata.professional[ service ] );
            caregiver.personalServices = caregiver.personalServices.map( service=> TCdata.personal[ service ] );
            caregiver.medicalConditions = caregiver.medicalConditions.map( mc=> TCdata.medical[ mc ] );
        }
        return caregiver;
    },
    activeClass( index ) {
        if( index === 0 ) return 'active';
    },
    notCurrentCaregiver() {
        return Caregivers.findOne( this.id ).user !== Meteor.userId();
    },
    caregiverBackgroundCheck() {
        return !!Caregivers.findOne( this.id ).background.length;
    },
    isBookmarked() {
        let id = Template.currentData().id();
        let bookmarks = Meteor.user().bookmarks;
        return _.indexOf( bookmarks, id ) !== -1;
    },
    isCustomer() {
        return Meteor.user().profile.type === 'customer';
    },
    msgDoc() {
        const recipient = Caregivers.findOne( this.id ).username();
        return { recipient };
    }
});

Template.CaregiverProfile.events({ 
    'click .favorite a'( e, t ) { 
        let id = t.data.id();
        bookmarkCaregiver.call({ id });
    },
    'click .finalise'() {   
        Meteor.call('caregiver.complete', ( err, res )=> {
            if( err ) {
                showAlert( err.reason, 'danger');
            } else {
                showAlert( 'Your Caregiver Profile has been submitted! You can now apply for Jobs!' );
            }
        });
    }
});

Template.hireCaregiverModal.onCreated(function() {
    this.autorun(()=> {
        this.subscribe( 'myJobs' );
    });
});

Template.hireCaregiverModal.helpers({
    texts() {
        return texts.get();
    },
    jobs() {
        return Jobs.find({
            postedBy: Meteor.userId(),
            status: { $in: ['open', 'hired'] }
        });
    },
    isApplicant() {
        let caregiver = this.caregiver, job = this.job;
        let a = _.indexOf( caregiver.appliedJobs, job._id ) !== -1;
        let b = _.indexOf( job.applicants, caregiver._id ) !== -1;
        return a && b;
    },
    isOffered() {
        let caregiver = this.caregiver, job = this.job;
        let a = _.indexOf( caregiver.offers, job._id ) !== -1;
        let b = _.indexOf( job.offers, caregiver._id ) !== -1;
        return a && b;
    },
    isHired() {
        let caregiver = this.caregiver, job = this.job;
        let a = caregiver.currentJob === job._id;
        let b = job.hired === caregiver._id;
        return a && b;
    }
});

Template.hireCaregiverModal.events({ 
    'click .accept'( e, t ) { 
        hireApplicant.call({
            job: t.$(e.target).attr('id'),
            applicant: t.data._id
        }, ( err, res )=> {
            if( err ) {
                showAlert( err.reason, 'danger');
            } else {
                showAlert('Job offer sent!');
            }
        });
    },

    'click .offer'( e, t ) {
        offerJob.call({
            job: t.$(e.target).attr('id'),
            caregiverId: t.data._id
        }, ( err, res )=> {
            if( err ) {
                showAlert( err.reason, 'danger');
            } else {
                showAlert('Job offer sent!');
            }
        });
    }
});
