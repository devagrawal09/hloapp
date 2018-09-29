import '../imports/startup/server';
import { Caregivers } from '../imports/api/caregivers';

const updateBgAndEdu = ()=> {
    console.log('Starting background and education data update');
    Caregivers.find({}).fetch().forEach( caregiver=> {
        if( caregiver.background && !caregiver.background[0] ) {
            Caregivers.update( caregiver._id, {
                $set: { background: [] }
            });
        }
        if( caregiver.education && !caregiver.education[0] ) {
            Caregivers.update( caregiver._id, {
                $set: { education: [] }
            });
        }
    });
    console.log('Finished background and education data update');
}

updateBgAndEdu();