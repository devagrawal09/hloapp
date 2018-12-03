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

export const jobDetails = new SimpleSchema({
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
        optional: true,
        defaultValue: ''        
    },
    phone: String,
    email: {
        type: SimpleSchema.RegEx.EmailWithTLD,
        optional: true,
        defaultValue: ''
    },
    address: String,
    location: Datatypes.Location,
    otherDistrict: {
        type: String,
        optional: true,
        defaultValue: '',
        label: 'Please specify district'
    },
    country: Datatypes.Country,
    hobbies: {
        type: String,
        optional: true,
        defaultValue: ''
    },
    languages: {
        type: Array,
        optional: true
    },
    'languages.$': Datatypes.Languages,
    description: {
        type: String
    }
});
export const jobRequirements = new SimpleSchema({
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
        label() {
            if( Meteor.isClient && Session.equals('lang', 'tc') )
                return '工作日*';
            return 'Work days*';
        }
    },
    'days.$': {
        type: Datatypes.WorkTime,
        label: null
    },
    jobDescription: String
});

export const detailsSchema = new SimpleSchema({});
detailsSchema.extend( jobDetails );
detailsSchema.extend( jobRequirements );

export const photoSchema = new SimpleSchema({
    _id: Datatypes.Id,
    job: String
});

export const reviewSchema = new SimpleSchema({
    _id: Datatypes.Id,
    job: Datatypes.Id,
    rating: SimpleSchema.Integer,
    content: {
        type: String,
        optional: true,
        defaultValue: ''
    },
    date: Date
});
