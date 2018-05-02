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
    gender: Datatypes.Gender,
    dob: Datatypes.Date,
    aboutText: {
        type: String,
        optional: true
    },
    address: String,
    location: Datatypes.Location,
    otherDistrict: {
        type: String,
        optional: true,
        label: 'Please specify district'
    },
    country: Datatypes.Country,
    religion: {
        type: String,
        allowedValues: [
            'Christian', 'Catholic', 'Buddhist', 'Muslim', 'Taoist', 'Hindu', 'Other'
        ]
    },
    hobbies: {
        type: String,
        optional: true
    },
    workLocation: Datatypes.Location,
    languages: Array,
    'languages.$': Datatypes.Languages,
//experience
    years: {
        type: SimpleSchema.Integer,
        label: 'Years of experience',
        optional: true
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
        label: 'Licenses and Credentials',
        optional: true
    },
    education: {
        type: String,
        label: 'Education History',
        optional: true
    },
//photos
    profileImg: {
        type: String,
        optional: true
    },
    coverImg: {
        type: String,
        optional: true
    },
    // photos: [String],
//services
    hourlyRate: Number,
    extraCharges: {
        type: Number,
        optional: true
    },
    serviceType: {
        type: Array,
        label: 'Preferred type of service',
        optional: true
    },
    'serviceType.$': {
        type: String,
        allowedValues: ['Live-in', 'Live-out']
    },
    ownsCar: {
        type: Boolean,
        label: 'Do you own a car?'
    },
    availability: Array,
    'availability.$': Datatypes.WorkTime,
    caregiverType: {
        type: Array,
        label: 'Type of Caregiver',
        optional: true
    },
    'caregiverType.$': Datatypes.CaregiverType,
    professionalServices: {
        type: Array,
        optional: true
    },
    'professionalServices.$': Datatypes.ProfessionalService,
    otherProfessionalService: Datatypes.OtherField,
    personalServices: {
        type: Array,
        optional: true
    },
    'personalServices.$': Datatypes.PersonalService,
    otherPersonalService: Datatypes.OtherField,
    medicalConditions: {
        type: Array,
        label: 'Medical Expertise',
        optional: true
    },
    'medicalConditions.$': Datatypes.MedicalCondition,
    otherMedicalCondition: Datatypes.OtherField,
//plan
    plan: {
        type: String,
        allowedValues: [ 'Free', 'Entrepreneur', 'Partner' ]
    }
});
