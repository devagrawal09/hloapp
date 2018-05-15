import { Template } from 'meteor/templating';

import { Caregivers } from '../../../api/caregivers';
import { hireApplicant } from '../../../api/jobs';

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
    isHired( status ) {
        return status !== 'open';
    },
    isCompleted( status ) {
        return status === 'completed';
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
        });
    } 
});
