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

Process after Job completion
---

After job completion, a 'Review' button should appear on the job panel. This will open a modal with a form with a 5 star input and a textarea. The customer will write and submit a review, which will set the `review` field of the job. After succesful submission, the review button should disappear, and a 'Pay' button should appear, along with a 'Decline Payment'. The 'Decline Payment' will ask for confirmation and reasons, and set `payment` to `declined` with the `reason` field. 'Pay' button will go to the Paypal chekout page.

Caregiver and Job fields privacy
---

##Caregiver

###Private Fields

* DOB
* Email
* Phone
* Address (except district)
* Plan Selected

###Public Fields

* Name
* Gender
* Location
* Work locations
* Languages
* Religion
* Hobbies
* About
* Education and Experience
* Rate, Services and Availability
* Photos

##Job

###Private Fields

* DOB
* HKID
* Phone
* Email
* Address (except district)

###Public Fields

* Job Duration
* Job Title
* Name
* Gender
* Location
* Hobbies
* Languages
* Describe
* Job Requirements
* Job Description
* Dates and Work time
* Photos

##Email/SMS requirements:

* Email verification – for new members (Email/SMS)
* Welcome to HLO – for new members (Email/SMS).
* Confirm total amount of job after job is accepted by Caregiver (Email/SMS)
* Messages between parties (Email).
* Missing information (Email) (Notifications to remind users to complete their Profile or Job Ad)
* New Job Ads (Email)
* New Caregivers (Email)
* Payment accept/decline (Email/SMS)
* Customer/Caregiver Review (Email/SMS)
* Job Expire/Delete (Email/SMS)