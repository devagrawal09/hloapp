import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

const Experience = new SimpleSchema({
    employer: {
        type: String,
        label: 'Name of Employer'
    },
    desc: {
        type: String,
        label: 'Job Description*'
    },
    from: Datatypes.Date,
    to: Datatypes.Date
});

export const detailsSchema = new SimpleSchema({
//details
    _id: Datatypes.Id,
    user: Datatypes.Id,
    firstName: String,
    lastName: String,
    gender: Datatypes.Gender,
    dob: Datatypes.Date,
    aboutText: String,
    address: String,
    location: Datatypes.Location,
    otherDistrict: Datatypes.OtherField,
    country: Datatypes.Country,
    religion: Datatypes.Religion,
    otherReligion: Datatypes.OtherField,
    hobbies: {
        type: String,
        optional: true,
        defaultValue: ''
    },
    workLocation: Array,
    'workLocation.$': Datatypes.WorkLocation,
    otherWorkLocations: Datatypes.OtherField,
    languages: Array,
    'languages.$': Datatypes.Languages,
    otherLanguages: Datatypes.OtherField
});

export const experienceSchema = new SimpleSchema({
//experience
    _id: Datatypes.Id,
    user: Datatypes.Id,
    years: {
        type: SimpleSchema.Integer,
        label: 'Years of experience*',
        optional: true,
        defaultValue: ''
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
        type: Array,
        optional: true,
        defaultValue: []
    },
    'background.$': {
        type: String,
        label: 'Licenses and Credentials'
    },
    education: {
        type: Array,
        optional: true,
        defaultValue: []
    },
    'education.$': {
        type: String,
        label: 'Education History'
    }
});

export const servicesSchema = new SimpleSchema({
//services
    _id: Datatypes.Id,
    user: Datatypes.Id,
    hourlyRate: Number,
    extraCharges: {
        type: Number,
        optional: true,
        defaultValue: ''
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
    availability: {
        type: Array,
        label: "Work Availability*"
    },
    'availability.$': {
        type: Datatypes.WorkTime,
        label: null
    },
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
    otherMedicalCondition: Datatypes.OtherField
});

export const pricingSchema = new SimpleSchema({
//plan
    _id: Datatypes.Id,
    user: Datatypes.Id,
    plan: {
        type: String,
        allowedValues: [ 'Free', 'Entrepreneur', 'Partner' ]
    }
});

export const photoSchema = new SimpleSchema({
    _id: Datatypes.Id
});
