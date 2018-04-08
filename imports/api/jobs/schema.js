import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

export const jobSchema = new SimpleSchema({
//details
    _id: Datatypes.Id,
    title: String,
    duration: String,
    postedBy: Datatypes.Id,
    postedOn: Date,
    status: String,
    applicants: Array,
    'applicants.$': Datatypes.Id,
    hired: Datatypes.Id,
//requirements
    startDate: Date,
    endDate: Date,
    days: Array,
    'days.$': Datatypes.Day,
    startTime: Datatypes.Time,
    endTime: Datatypes.Time,
    caregiverType: Array,
    'caregiverType.$': Datatypes.CaregiverType,
    professionalServices: Array,
    'professionalServices.$': Datatypes.ProfessionalService,
    personalServices: Array,
    'personalServices.$': Datatypes.PersonalService,
    medicalConditions: Array,
    'medicalConditions.$': Datatypes.MedicalCondition,
//patient
    gender: String,
    dob: Date,
    hkid: String,
    phone: String,
    email: SimpleSchema.RegEx.EmailWithTLD,
    address: String,
    district: String,
    country: String,
    hobbies: String,
    description: String,
    languages: Array,
    'languages.$': Datatypes.Languages
});