Healthy Loved Ones
===================
##Expected data schema



```javascript
hlo: {
    users: {
        id,
        name,
        email,
        type: ['customer', 'caregiver'],
        bookmarks: Array<UserId>,
        ...profile,
        customerInfo: {
            
        },
        caregiverInfo: {

        }
    },
    jobs: {
        id,
        postedBy: UserId,
        postedOn: Date,
        title,
        location,
        medicalConditions,
        type,
        languages,
        gender,
        jobStatus: ['open', 'closed'],
        hired: UserId,
        services: {
            profession: Array,
            personal: Array
        }
    },
    messages: {
        id,
        from: UserId,
        to: UserId,
        msg: String,
        sent: Date,
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

* Landing page - `/`
* Terms of Use - `/terms`
* Privacy Policy - `/privacy`
* Community Guidelines - `/community`
* About Us - `/about`
* Contact Us - `/contact`
* Q&A with CEO - `/faq`