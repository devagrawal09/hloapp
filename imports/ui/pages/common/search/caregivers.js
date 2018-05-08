import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';
import '../../../shared-components/caregiver-card';
import { subscription, displayTemplate, collection } from '.';

export function searchForCaregivers() {
    subscription.set( 'caregivers' );
    displayTemplate.set( 'caregiverCard' );
    collection.set( Caregivers );
}

