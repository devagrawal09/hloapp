import SimpleSchema from 'simpl-schema';

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
        allowedValues: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
            'Saturday', 'Sunday'
        ]
    },
    Date: {
        type: String,
        autoform: { type: 'date' }
    },
    CaregiverType: {
        type: String,
        allowedValues: [ 
            'Volunteer Caregivers', 'Nursing Students', 'Home Nurse',
            'Eldercare', 'Weekend Caregivers', 'Special Needs',
            'Specialist Caregivers', 'Expert Caregivers',
            'TLC Caregivers', 'Licensed Nurse', 'Sports Buddies'
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
            'Allergy', "Alzheimer's Disease", 'Anemia',
            'Arthritis', 'Asthma', 'Blindness', 'Breast Disease',
            'Cancer', 'Dementia', 'Depression', 'Diabetes',
            'Foot Problem', 'Hypertension', 'Kidney Disease',
            "Parkinson's Disease", 'Stroke'
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
            'Yuen Long', 'Kowloon', 'Yau Tsim Mong',
            'Islands', 'Kwai Tsing', 'North', 'Sai Kung',
            'Tai Po', 'Tsuen Wan', 'Tuen Mun', 'Wong Tai Sin',
            'Sha Tin', 'Kwun Tong', 'Sham Shui Po',
            'Central and Western', 'Eastern', 'Southern', 'Wan Chai',
            'Other'
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
        optional: true,
        max: 50,
        autoform: {
            label: false
        }
    }
}

Datatypes.WorkTime = new SimpleSchema({
    day: Datatypes.Day,
    start: Datatypes.Time,
    end: Datatypes.Time
});
