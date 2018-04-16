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
    from: Date,
    to: Date
});
export const profileSchema = new SimpleSchema({
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
    dob: Date,
    aboutText: String,
    address: String,
    district: Datatypes.Location,
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
    'languages.$': Datatypes.Languages
});
export const experienceSchema = new SimpleSchema({
    _id: Datatypes.Id,
    user: Datatypes.Id,
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
    }
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
    hourlyRate: Number,
    extraCharges: Number,
    ownsCar: {
        type: Boolean,
        label: 'Do you own a car?'
    },
    availableDays: Array,
    'availableDays.$': Datatypes.Day,
    availableTimeStart: Datatypes.Time,
    availableTimeEnd: Datatypes.Time,
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
    'medicalConditions.$': Datatypes.MedicalCondition
});
export const pricingSchema = new SimpleSchema({
    _id: Datatypes.Id,
    user: Datatypes.Id,
    plan: {
        type: String,
        allowedValues: [ 'Free', 'Entrepreneur', 'Partner' ]
    }
});
export const employmentSchema = new SimpleSchema({  //for reference
    currentJob: Datatypes.Id,
    appliedJobs: Array,                 //jobs applied in chronological order
    'appliedJobs.$': Datatypes.Id,
    jobHistory: Array,                  //job history in chronological order
    'jobHistory.$': Datatypes.Id
});