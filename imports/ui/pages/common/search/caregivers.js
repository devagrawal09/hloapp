import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';
import '../../../shared-components/caregiver-card';
import '../../../shared-components/caregiver-list';
import './slider/css/slider.css';
import './slider/js/bootstrap-slider.js';
import { subscription, gridTemplate, listTemplate, collection, resetFilters } from '.';

export function searchForCaregivers() {
    subscription.set( 'caregivers' );
    gridTemplate.set( 'caregiverCard' );
    listTemplate.set( 'caregiverList' );
    collection.set( Caregivers );
    resetFilters();
    $('#slider').slider({
        min: 0,
        max: 500
    });
}

