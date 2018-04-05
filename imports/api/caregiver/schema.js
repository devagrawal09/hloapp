import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

export const caregiverSchema = new SimpleSchema({
//profile
    _id: Datatypes.Id,
    user: Datatypes.Id,
    dob: Date,
    aboutText: String,
    address: String,
    district: String,
    country: String,
    religion: String,
    hobbies: String,
    workLocation: String,
    languages: Array,
    'languages.$': Datatypes.Languages,
    profileImg: String,
    coverImg: String,
//experience
    experience: SimpleSchema.Integer,
    background: String,
    education: String,
//services
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