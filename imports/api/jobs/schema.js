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
        label: 'HKID or Passport number'
    },
    phone: String,
    email: SimpleSchema.RegEx.EmailWithTLD,
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
    languages: Array,
    'languages.$': Datatypes.Languages,
    description: {
        type: String,
        label: 'Describe your loved one',
        optional: true
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
        label: null,
        autoform: { label: false }
    },
    jobDescription: String
});
