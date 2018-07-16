import { Template } from 'meteor/templating';

import './card.html';

Template.caregiverCard.onCreated(function() {
    let dpId = this.data.profilePhoto;
    this.subscribe( 'caregiver.image', dpId );
});
