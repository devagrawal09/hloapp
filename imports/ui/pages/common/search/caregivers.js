import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';
import '../../../shared-components/caregiver-card';
import './slider/css/slider.css';
import './slider/js/bootstrap-slider.js';
import { subscription, displayTemplate, collection } from '.';

export function searchForCaregivers() {
    subscription.set( 'caregivers' );
    displayTemplate.set( 'caregiverCard' );
    collection.set( Caregivers );
}

