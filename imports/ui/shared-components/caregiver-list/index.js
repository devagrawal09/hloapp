import { Template } from 'meteor/templating';

import { CaregiverImages } from '../../../api/caregivers';

import './list.html';

Template.caregiverList.onCreated(function() {
    let dpId = this.data.profilePhoto;
    this.autorun(()=> {
        this.subscribe( 'caregiver.image', dpId )
    });
});