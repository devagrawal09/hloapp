Healthy Loved Ones
===================
Data schema
------------------

```javascript
db: {
    users: {
        id,
        email,
        phone,
        password,
        emailVerified: Boolean,
        phoneVerified: Boolean,
        emailNotify: Boolean,
        smsNotify: Boolean,
        firstName,
        lastName,
        gender,
        type: ['customer', 'caregiver'],
        bookmarks: Array<UserId>
    },
    caregiver: {
        id,
        user: UserId,
        dob: Date,
        aboutText,
        profileImg,
        coverImg,
        address,
        district,
        country,
        religion,
        hobbies,
        workLocation,
        experience: Number,
        hourlyRate: Number,
        extraCharges: Number,
        currentlyAvailable: Boolean,
        ownsCar: Boolean,
        background: String,
        education: String,
        availableDays: Array<Days>,
        availableTimeStart: Time,
        availableTimeEnd: Time,
        type: Array<CaregiverTypes>,
        professionalServices: Array<ProfessionalServices>,
        personalServices: Array<PersonalServices>,
        medicalExpertise: Array<MedicalConditions>,
        languages: Array<Languages>
    },
    experience: {
        id,
        user: UserId,
        employer,
        work,
        from: Date,
        to: Date
    },
    jobs: {
        id,
        postedBy: UserId,
        postedOn: Date,
        title,
        medicalConditions,
        startDate: Date,
        endDate: Date,
        days: Array<Days>,
        startTime: Time,
        endTime: Time,
        jobStatus: ['open', 'closed'],
        applicants: Array<UserId>,
        hired: UserId,
        photos: Array<>,
        type: Array<CaregiverTypes>,
        professionalServices: Array<ProfessionalServices>,
        personalServices: Array<PersonalServices>,
        medicalConditions: Array<MedicalConditions>,
        patient: {
            gender,
            dob,
            hkid,
            phone,
            email,
            address,
            district,
            country,
            hobbies,
            description,
            languages: Array<Languages>
        }
    },
    messages: {
        id,
        from: UserId,
        to: UserId,
        msg: String,
        sent: Date,
        status: Number
    },
    reviews: {
        id,
        for: UserId,
        from: UserId,
        stars: [1, 2, 3, 4, 5],
        content
    }
},
dataTypes: {
    Time: "HH:MM time format in 24hr clock",
    CaregiverTypes: [ 
        "Volunteer Caregivers", "Nursing Students", "Home Nurse",
        "Eldercare", "Weekend Caregivers", "Special Needs",
        "Specialist Caregivers", "Expert Caregivers",
        "TLC Caregivers", "Licensed Nurse"
    ],
    ProfessionalServices: [
        "Addiction Counselor", "Beautician", "Chinese Medicine Expert",
        "Chiropractor", "Eldercare", "Hair Stylist", "Licensed Nurse",
        "Occupational Therapist", "Massage Therapist", "Personal Trainer",
        "Yoga Instructor", "Physiotherapist", "Midwife", "Reflexologist",
        "Special Needs Therapist", "Speech Therapist",
        "Spiritual/Body/Mind Expert", "Sports Therapist"
    ],
    PersonalServices: [
        "Bathing", "Companionship", "Exercise", "Groceries and Shopping",
        "Grooming", "Housekeeping", "Managing Medications",
        "Meal Prep", "Transferring and Mobility", "Toileting",
        "Transportation", "Travel Companion"
    ],
    MedicalConditions: [
        "Allergy", "Alzheimer's Disease", "Anemia",
        "Arthritis", "Asthma", "Blindness", "Breast Disease",
        "Cancer", "Dementia", "Depression", "Diabetes",
        "Foot Problem", "Hypertension", "Kidney Disease",
        "Parkinson's Disease", "Stroke",
    ],
    Languages: [
        "Cantonese", "English", "French", "German", "Italian",
        "Japanese", "Korean", "Putonghua", "Spanish", "Tagalog"
    ]
}
```

Routes
--------------

###Public Routes

* Landing page - `/`
* Search Caregivers* - `/caregivers`
* Caregiver profile* - `/caregiver/:id`
* Search Jobs** - `/jobs`
* Job Details** - `/job/:id`
* Account - `/account`
* Login - `/login`
* Register - `/register`
* Terms of Use - `/terms`
* Privacy Policy - `/privacy`
* Community Guidelines - `/community`
* About Us - `/about`
* Contact Us - `/contact`
* Q&A with CEO - `/faq`

*: Hire option redirects to customer login <br>
**: Apply option redirects to caregiver login

###Caregiver Routes

* Dashboard/Job history - `/`
* Messages - `/chat`
* Edit Profile - `/profile`
* Settings - `/settings`

###Customer Routes

* Dashboard/Posted jobs - `/`
* Messages - `/chat`
* Edit Profile - `/profile`
* Settings - `/settings`

###Forum Routes

* Main Page - `/forum`
* Following - `/forum/following`
* Category - `/forum/:category`
* Thread - `/forum/:id`

Third Party service providers
---------------------------------

* Login Providers - Google, Facebook (using meteor's `accounts-facebook` and `accounts-google`)
* SMTP Provider - Sendgrid (using meteor's `email`)
* SMS Provider - Twilio (using npm's `twilio`)
* Checkout Provider - Paypal (express checkout)

Questions for next meeting
-------------------------------

* We need service configuration details to integrate the above 3rd party service providers.

* What do you want the Search option in the Search filters sidebar to do?

* What is the composition of photos for a job post? Does it consist a cover photo and a display photo (like the caregiver profile)? Or is it just a few display photos (like a small gallery)?
* Can a customer edit job details after it's been posted? And after a caregiver has been hired?
* Can a caregiver withdraw his application for a job while it's still open?
* Can a customer mark a job as complete without hiring anyone?
* How is the cost of the job determined? Do the customer/caregiver need to inform HLO about the final negotiated price before the job starts or after completion?
* Can only a customer mark a job as complete? Do we require no such consent from the caregiver?
* After a customer hires a caregiver, will all the other applications of the caregiver be removed?
* Can a customer edit his review to a caregiver?
* If a customer hires a caregiver he has hired before for a new job, will he give another review? Will it replace the old review?
* After the completion of a job, when the customer sends his payment, should it automatically transfer to the caregiver's paypal (after deducting commission)?

* The Forum section is not included in the quotation, but we did get Forum home and topic screenshots. Do you want us to make it?
* We are only developing the webapp in English. However the sample front-end supplied to us has an option for Chinese too. Do you want us to make a Chinese version too?
