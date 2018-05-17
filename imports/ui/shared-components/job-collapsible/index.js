import { Template } from 'meteor/templating';

import { Caregivers } from '../../../api/caregivers';
import { hireApplicant, completeJob } from '../../../api/jobs';

import showAlert from '../alert';

import '../../helpers';
import './collapsible.html';

Template.jobCollapsible.onCreated(function() {
    this.autorun(()=> {
        let data = Template.currentData();
        this.subscribe( 'jobs.images', data._id );
        if( data.applicants ) this.subscribe( 'caregiversById', data.applicants );
        if( data.hired ) {
            this.subscribe( 'caregiverById', data.hired );
            this.subscribe( 'caregiverById.images', data.hired );
        }
    });
});

Template.jobCollapsible.helpers({
    isOpen() {
        return this.status === 'open';
    },
    isHired() {
        return this.status === 'hired' || this.status === 'completed';
    },
    isCompleted() {
        return this.status === 'completed' || this.status === 'expired';
    },
    isOwnedByCurrentUser() {
        return this.postedBy === Meteor.userId();
    },
    rightImageSrc() {
        return this.dp().link();
    },
    appliedCaregivers() {
        return this.appliedCaregivers();
    },
    hiredCaregiver() {
        console.log(this);
        return this.hiredCaregiver();
    }
});

Template.jobCollapsible.events({ 
    'click .hire'( e, t ) { 
        hireApplicant.call({
            job: t.data._id,
            applicant: t.$(e.target).attr('id')
        }, ( err, res )=> {
            if( err ) {
                console.error( err );
            } else {
                showAlert('Sucessfully hired this caregiver!');
            }
        });
    },
    'click .complete'( e, t ) {
        completeJob.call({ _id: t.data._id }, ( err, res )=> {
            if( err ) {
                console.error( err );
            } else {
                showAlert(`Sucessfully ${res} this job!`);
            }
        });
    }
});
