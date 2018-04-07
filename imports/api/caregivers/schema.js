import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

const Experience = new SimpleSchema({
    employer: String,
    desc: String,
    from: Date,
    to: Date
});

export const profileSchema = new SimpleSchema({
    _id: Datatypes.Id,
    user: Datatypes.Id,
    firstName: String,
    lastName: String,
    gender: String,
    dob: Date,
    aboutText: String,
    address: String,
    district: String,
    country: String,
    religion: String,
    hobbies: String,
    workLocation: String,
    languages: Array,
    'languages.$': Datatypes.Languages
});
export const experienceSchema = new SimpleSchema({
    _id: Datatypes.Id,
    user: Datatypes.Id,
    years: SimpleSchema.Integer,
    experiences: Array,
    'experiences.$': Experience,
    background: String,
    education: String
});
export const imagesSchema = new SimpleSchema({
    _id: Datatypes.Id,
    user: Datatypes.Id,
    profileImg: String,
    coverImg: String
});
export const servicesSchema = new SimpleSchema({
    _id: Datatypes.Id,
    user: Datatypes.Id,
    currentlyAvailable: Boolean,
    hourlyRate: Number,
    extraCharges: Number,
    ownsCar: Boolean,
    availableDays: Array,
    'availableDays.$': Datatypes.Day,
    availableTimeStart: Datatypes.Time,
    availableTimeEnd: Datatypes.Time,
    caregiverType: Array,
    'caregiverType.$': Datatypes.CaregiverType,
    professionalServices: Array,
    'professionalServices.$': Datatypes.ProfessionalService,
    personalServices: Array,
    'personalServices.$': Datatypes.PersonalService,
    medicalExpertise: Array,
    'medicalExpertise.$': Datatypes.MedicalCondition
});
