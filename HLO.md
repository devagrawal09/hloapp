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
    }
}
```