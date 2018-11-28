import SimpleSchema from 'simpl-schema';

import TcData from './tc.js';

SimpleSchema.extendOptions(['autoform']);

const days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
    'Saturday', 'Sunday'
]

export default Datatypes = {
    Id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,   //Meteor id format
        autoform: { type: 'hidden' }
    },
    Gender: {
        type: String,
        allowedValues: ['Male', 'Female']   //Gender values
    },
    Time: {
        type: String,
        regEx: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,  // H:MM/HH:MM format
        autoform: {
            type: 'time'
        }
    },
    Day: {
        type: String,
        allowedValues: days,
        label() {
            if( Meteor.isClient && Session.equals('lang', 'tc') )
                return '日子*';
            return 'Day';
        },
        autoform: {
            options() {
                if( Meteor.isClient && Session.equals('lang', 'tc') )
                    return Object.assign({}, TcData.days );
                return 'allowed';
            }
        }
    },
    Date: {
        type: String,
        autoform: { type: 'date' }
    },
    CaregiverType: {
        type: String,
        allowedValues: [ 
            'Volunteer', 'Nursing Students', 'Home Nurse',
            'Eldercare', 'Weekend', 'Special Needs',
            'Specialist', 'Expert',
            'TLC', 'Licensed Nurse', 'Sports Buddies'
        ]
    },
    ProfessionalService: {
        type: String,
        allowedValues: [
            'Addiction Counselor', 'Beautician', 'Chinese Medicine Expert',
            'Chiropractor', 'Eldercare', 'Hair Stylist', 'Licensed Nurse',
            'Occupational Therapist', 'Massage Therapist', 'Personal Trainer',
            'Yoga Instructor', 'Physiotherapist', 'Midwife', 'Reflexologist',
            'Special Needs Therapist', 'Speech Therapist',
            'Spiritual/Body/Mind Expert', 'Sports Therapist'
        ]
    },
    PersonalService: {
        type: String,
        allowedValues: [
            'Bathing', 'Companionship', 'Exercise', 'Groceries and Shopping',
            'Grooming', 'Housekeeping', 'Managing Medications',
            'Meal Prep', 'Transferring and Mobility', 'Toileting',
            'Transportation', 'Travel Companion'
        ]
    },
    MedicalCondition: {
        type: String,
        allowedValues: [
            "ALS", "Allergy", "Alzheimer's Disease", "Anemia", "Arthritis",
            "Asthma", "Autism/ADHD", "Blindness", "Blood Disorders",
            "Breast Disease", "COPD", "Cancer", "Cardiovascular Disorders",
            "Dementia", "Depression", "Diabetes", "Foot Problem",
            "Gastronomical Disorders", "HIV/AIDS", "Hearing Disorders",
            "Home Healthcare", "Hospice Care", "Hypertension", "Kidney Disease",
            "Multiple Sclerosis", "Neurological Disorders", "Orthopedic Care",
            "Palliative Care", "Parkinson's Disease", "Post Surgery Recovery",
            "Renal and Urological Disorders", "Respiratory Disorders",
            "Skin Disorders", "Stroke", "Tracheotomy/Ventilation",
            "Vision and Eye Disorders"
        ]
    },
    Languages: {
        type: String,
        allowedValues: [
            'Cantonese', 'English', 'French', 'German', 'Italian',
            'Japanese', 'Korean', 'Putonghua', 'Spanish', 'Tagalog'
        ]
    },
    Religion: {
        type: String,
        allowedValues: [
            'Christian', 'Catholic', 'Buddhist', 'Muslim', 'Taoist', 'Hindu', 'Other'
        ]
    },
    Location: {
        type: String,
        label: 'District',
        allowedValues: [
            "Central and Western", "Eastern", "Islands", "Kowloon",
            "Kwai Tsing", "Kwun Tong", "North", "Sai Kung",
            "Sha Tin", "Sham Shui Po", "Southern", "Tai Po",
            "Tsuen Wan", "Tuen Mun", "Wan Chai", "Wong Tai Sin",
            "Yau Tsim Mong", "Yuen Long", "Other"
        ]
    },
    WorkLocation: {
        type: String,
        allowedValues: [
            "Central and Western", "Eastern", "Islands", "Kowloon",
            "Kwai Tsing", "Kwun Tong", "North", "Sai Kung",
            "Sha Tin", "Sham Shui Po", "Southern", "Tai Po",
            "Tsuen Wan", "Tuen Mun", "Wan Chai", "Wong Tai Sin",
            "Yau Tsim Mong", "Yuen Long"
        ]
    },
    Country: {
        type: String,
        allowedValues: [
            'Hong Kong', 'China', 'Singapore',
            'Malaysia', 'India'
        ]
    },
    OtherField: {
        type: String,
        max: 50,
        defaultValue: '',
        optional: true,
        autoform: {
            label: false
        }
    }
}

Datatypes.WorkTime = new SimpleSchema({
    day: Datatypes.Day,
    start: Object.assign({ label() {
        if( Meteor.isClient && Session.equals('lang', 'tc') )
            return '開始';
        return 'Start';
    }}, Datatypes.Time),
    end: Object.assign({ label() {
        if( Meteor.isClient && Session.equals('lang', 'tc') )
            return '結束';
        return 'End';
    }}, Datatypes.Time)
});
