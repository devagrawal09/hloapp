import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

export const jobSchema = new SimpleSchema({
    _id: Datatypes.Id,
    postedBy: Datatypes.Id,
    postedOn: Date,
    status: {
        type: String,
        allowedValues: ['open', 'hired', 'completed']
    },
    applicants: Array,
    'applicants.$': Datatypes.Id,
    offers: Array,
    'offers.$': Datatypes.Id,
    hired: Datatypes.Id
});

export const detailsSchema = new SimpleSchema({
//job details
    _id: Datatypes.Id,
    postedBy: Datatypes.Id,
    title: {
        type: String,
        label: 'Job Title'
    },
    duration: {
        type: String,
        label: 'Job Duration',
        allowedValues: ['Short term','Long term']
    },
    name: String,
    gender: Datatypes.Gender,
    dob: Datatypes.Date,
    hkid: {
        type: String,
        label: 'HKID or Passport number',
        optional: true
    },
    phone: String,
    email: {
        type: SimpleSchema.RegEx.EmailWithTLD,
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
    hobbies: {
        type: String,
        optional: true
    },
    languages: {
        type: Array,
        optional: true
    },
    'languages.$': Datatypes.Languages,
    description: {
        type: String
    },
//requirements
    caregiverType: {
        type: Array,
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
        optional: true
    },
    'medicalConditions.$': Datatypes.MedicalCondition,
    otherMedicalCondition: Datatypes.OtherField,
    startDate: Datatypes.Date,
    endDate: Datatypes.Date,
    days: {
        type: Array,
        label: "Work days*"
    },
    'days.$': {
        type: Datatypes.WorkTime,
        label: null
    },
    jobDescription: String
});

export const photoSchema = new SimpleSchema({
    _id: Datatypes.Id,
    job: String
});

export const reviewSchema = new SimpleSchema({
    _id: Datatypes.Id,
    job: Datatypes.Id,
    stars: SimpleSchema.Integer,
    content: {
        type: String,
        optional: true
    },
    date: Date
});
