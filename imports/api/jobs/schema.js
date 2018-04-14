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
    dob: Date,
    hkid: {
        type: String,
        label: 'HKID or Passport number'
    },
    phone: String,
    email: SimpleSchema.RegEx.EmailWithTLD,
    address: String,
    district: String,
    country: String,
    hobbies: String,
    languages: Array,
    'languages.$': Datatypes.Languages,
    description: {
        type: String,
        label: 'Describe your loved one (optional)',
        optional: true
    },
//requirements
    caregiverType: Array,
    'caregiverType.$': Datatypes.CaregiverType,
    professionalServices: Array,
    'professionalServices.$': Datatypes.ProfessionalService,
    personalServices: Array,
    'personalServices.$': Datatypes.PersonalService,
    medicalConditions: Array,
    'medicalConditions.$': Datatypes.MedicalCondition,
    startDate: Date,
    endDate: Date,
    days: Array,
    'days.$': Datatypes.Day,
    startTime: Datatypes.Time,
    endTime: Datatypes.Time,
    jobDescription: String
});
