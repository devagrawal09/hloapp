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
    title: String,
    duration: {
        type: String,
        allowedValues: ['Short term','Long term']
    },
    gender: String,
    dob: Date,
    hkid: String,
    phone: String,
    email: SimpleSchema.RegEx.EmailWithTLD,
    address: String,
    district: String,
    country: String,
    hobbies: String,
    languages: Array,
    'languages.$': Datatypes.Languages,
    desciption: String,
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
