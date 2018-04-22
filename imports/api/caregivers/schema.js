import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

const Experience = new SimpleSchema({
    employer: {
        type: String,
        label: 'Name of Employer'
    },
    desc: {
        type: String,
        label: 'Job Description'
    },
    from: Datatypes.Date,
    to: Datatypes.Date
});

export const caregiverSchema = new SimpleSchema({
//details
    _id: Datatypes.Id,
    user: Datatypes.Id,
    firstName: String,
    lastName: String,
    fullName: {
        type: String,
        optional: true,
        autoValue() {
            let firstName = this.field( 'firstName' ).value;
            let lastName = this.field( 'lastName' ).value;
            return `${firstName} ${lastName}`;
        }
    },
    gender: Datatypes.Gender,
    dob: Datatypes.Date,
    aboutText: String,
    address: String,
    location: Datatypes.Location,
    otherDistrict: {
        type: String,
        optional: true,
        label: 'Please specify district'
    },
    country: Datatypes.Country,
    religion: String,
    hobbies: String,
    workLocation: String,
    languages: Array,
    'languages.$': Datatypes.Languages,
//experience
    years: {
        type: SimpleSchema.Integer,
        label: 'Years of experience'
    },
    experiences: {
        type: Array,
        optional: true
    },
    'experiences.$': {
        type: Experience,
        label: 'Experience'
    },
    background: {
        type: String,
        label: 'Licenses and Credentials'
    },
    education: {
        type: String,
        label: 'Education History'
    },
//photos
    profileImg: String,
    coverImg: String,
    photos: [String],
//services
    hourlyRate: Number,
    extraCharges: Number,
    ownsCar: {
        type: Boolean,
        label: 'Do you own a car?'
    },
    availability: Array,
    'availability.$': Datatypes.WorkTime,
    caregiverType: {
        type: Array,
        label: 'Type of Caregiver'
    },
    'caregiverType.$': Datatypes.CaregiverType,
    professionalServices: Array,
    'professionalServices.$': Datatypes.ProfessionalService,
    personalServices: Array,
    'personalServices.$': Datatypes.PersonalService,
    medicalConditions: {
        type: Array,
        label: 'Medical Expertise'
    },
    'medicalConditions.$': Datatypes.MedicalCondition,
//plan
    plan: {
        type: String,
        allowedValues: [ 'Free', 'Entrepreneur', 'Partner' ]
    }
});
