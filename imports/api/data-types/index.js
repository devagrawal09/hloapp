import SimpleSchema from 'simpl-schema';

export default {
    Id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id    //Meteor id format
    },
    Time: {
        type: String,
        regEx: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/  // H:MM/HH:MM format
    },
    Day: {
        type:String,
        allowedValues: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
            'Saturday', 'Sunday'
        ]
    },
    CaregiverType: {
        type: String,
        allowedValues: [ 
            'Volunteer Caregivers', 'Nursing Students', 'Home Nurse',
            'Eldercare', 'Weekend Caregivers', 'Special Needs',
            'Specialist Caregivers', 'Expert Caregivers',
            'TLC Caregivers', 'Licensed Nurse'
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
    Language: {
        type: String,
        allowedValues: [
            'Cantonese', 'English', 'French', 'German', 'Italian',
            'Japanese', 'Korean', 'Putonghua', 'Spanish', 'Tagalog'
        ]
    }
}