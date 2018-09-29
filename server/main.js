import '../imports/startup/server';

const updateBgAndEdu = ()=> {
    console.log('Starting background and education data update');
    Caregivers.find({}).fetch().forEach( caregiver=> {
        if( !caregiver.background[0] ) {
            Caregivers.update( caregiver._id, {
                $set: { background: [] }
            });
        }
        if( !caregiver.education[0] ) {
            Caregivers.update( caregiver._id, {
                $set: { education: [] }
            });
        }
    });
    console.log('Finished background and education data update');
}

updateBgAndEdu();