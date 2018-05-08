import { Template } from 'meteor/templating';

import { CaregiverImages } from '../../../api/caregivers';

import './card.html';

Template.caregiverCard.onCreated(function() {
    let dpId = this.data.profilePhoto;
    this.autorun(()=> {
        this.subscribe( 'caregiver.image', dpId )
    });
});
