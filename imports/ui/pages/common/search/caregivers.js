import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';
import '../../../shared-components/caregiver-card';
import '../../../shared-components/caregiver-list';
import './slider/css/slider.css';
import './slider/js/bootstrap-slider.js';
import { subscription, gridTemplate, listTemplate, collection, sortKeys, Sort, resetFilters } from '.';

export function searchForCaregivers() {
    subscription.set( 'caregivers' );
    gridTemplate.set( 'caregiverCard' );
    listTemplate.set( 'caregiverList' );
    collection.set( Caregivers );
    sortKeys.set(['name', 'hourlyRate']);
    Sort.set({ name: 1 });
    resetFilters();
    $('#slider').slider({
        min: 0,
        max: 500
    });
}

