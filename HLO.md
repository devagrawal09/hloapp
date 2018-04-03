Healthy Loved Ones
===================
##Data schema

```javascript
hlo: {
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
        address,
        type: ['customer', 'caregiver'],
        bookmarks: Array<UserId>
    },
    caregiver: {
        id,
        user: UserId,
        dob: Date,
        description,
        aboutText,
        profileImg,
        coverImg,
        district,
        country,
        religion,
        hobbies,
        workLocation,
        experience: Number,
        hourlyRate: Number,
        extraCharges: Number,
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
}
```

##Routes

###Public Routes

* Landing page - `/`
* Terms of Use - `/terms`
* Privacy Policy - `/privacy`
* Community Guidelines - `/community`
* About Us - `/about`
* Contact Us - `/contact`
* Q&A with CEO - `/faq`
* Login - `/login`
* Register - `/register`

###Caregiver Routes

* Dashboard - `/`
* Search Jobs - `/jobs`
* Job details - `/job/:id`
* Public profile - `/profile`

###Customer Routes

* Dashboard - `/`
* Search Caregivers - `/caregivers`
* Caregiver profile - `/caregiver/:id`
* Profile - `/profile`

##Third Party service providers

* Login Providers - Google, Facebook (using meteor's `accounts-facebook` and `accounts-google`)
* SMTP Provider - Sendgrid (using meteor's `email`)
* SMS Provider - Twilio (using npm's `twilio`)
* Checkout Provider - Paypal (using express checkout)