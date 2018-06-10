import { Template } from 'meteor/templating';

import './faq.html';

Template.FAQ.helpers({
    faqs: [
        {
            title: 'What is the difference between HLO and incumbents?',
            paragraphs: [
                `
                    Homecare is an old traditional and conservative business.
                    Normally people will go to recruitment agencies that specialize
                    in Caregivers/Nurses. Government and NGO’s also provide this
                    service and act as agencies. These incumbents mostly focus on
                    long-term medical care jobs (requiring hard skills), customers that
                    need help more than once a week on a permanent or semi-permanent
                    basis (elderly, sick, special needs, etc.). There has been very
                    little innovation in this area.
                `,
                `
                    HLO believes in innovation and leveraging the latest technology
                    to help people live healthier and happier. By people we want to
                    expand the traditional thinking of just seniors, sick, special needs,
                    and children as customers. We want to help even more people like
                    housewives, single parents, singles, even students to become customers.
                    We will develop new and innovative homecare services like TLC, Everyday,
                    and Lastminute Care (like FedEx for homecare).
                `
            ]
        },
        {
            title: 'What makes your Caregivers the best in the business?',
            paragraphs: [
                `
                    Inventory is King, to be able to provide you with good service
                    we need to find the right people for the job. This is not an
                    easy process. You have to know where to look, how to qualify
                    and how to convince people to join. Do they have the right job
                    aptitude?  We spend a lot of resources to make sure we recruit
                    the best people for the job. We have an on-boarding process that
                    includes background and security checks, certified online video
                    training, and Tender Loving Care training.
                `,
                `
                    Our supply policy is open and inclusive meaning we recruit both
                    medical professionals and non-professionals (can be your neighbor).
                    Anyone can become a Caregiver as long as you have a good heart
                    and passion to help other people. All Caregivers will go through
                    our on-boarding process. We focus more on the non-professionals
                    and work with community based partners to help us with recruitment.
                    For us finding new people is important, we want to empower the
                    people in the community to help each other. We call this N2N power
                    and Community Trade.
                `
            ]
        },
        {
            title: 'Do I have what it takes to be a good Caregiver?',
            list: [
                `Do you have a good heart and passion to help other people?`,
                `Are you willing to learn and improve yourself?`,
                `Do you want to contribute to society?`,
                ` Do you want more financial independence?`
            ]
        },
        {
            title: 'Why should I use HLO?',
            list: [
                `Are you getting good service from incumbents?`,
                `Do they allow you to choose your Caregivers?`,
                `Do they keep you waiting and waiting and waiting?`,
                `Do they have flexible prices and options for you?`,
                `Do they over promise and under deliver?`
            ]
        },
        {
            title: 'Why should I really use HLO?',
            list: [
                `We give you the power to choose the right person for the job.`,
                `No more waiting in lines get immediate service (DIY online, digital/mobile health).`,
                `Caregivers work for themselves so you can negotiate directly with them.`,
                `Full transparency meaning we give you their profiles including personality information and real customer reviews.`,
                `Training – we provide online video training to teach our Caregivers how to look after Elderly, Children, Babies, etc.  We focus on technical as well as soft skills (Tender Loving Care/Consumer Centered Care).`,
                `Trust/Security/Confidence – We have insurance to cover bodily injury, property damage and theft in case something goes wrong.  We do comprehensive background and security checks on all our Caregivers.  We put our money where our mouth is, no like no pay policy.`,
                `Completely free with insurance and satisfaction guarantee.  We make money by taking a small commission from Caregivers.`
            ]
        },
        {
            title: 'Is it easy to join?',
            list: [
                `Yes and completely free for both Customers and Caregivers.`,
                `Just go to our website and hit the Join us button, all we need is name and email.`,
                `Start changing your life for the better, take action and start walking the talk.`
            ]
        },
        {
            title: 'How much does the service cost?',
            list: [
                `First it’s free to join.`,
                `For Customers you pay only what the Caregiver is charging.  You can even negotiate and get the best deal possible.  Most Caregivers will charge by the hour, but if you need them for long-term jobs then you can negotiate a monthly rate.  Some Caregivers will be Volunteers meaning they will cost you nothing.`,
                `For Caregivers you can charge what you want, but please be reasonable based on market pricing.`,
                `Both parties can negotiate and do a trial run to make sure everybody is happy and satisfied.  Trial runs is normally at a discount and important for new business.`,
                `HLO charges a nominal fee from the Caregivers, nothing from Customers.`
            ]
        },
        {
            title: 'Will my data be safe?',
            paragraphs: [
                `
                    Yes, we take data privacy very seriously. Whether you are a
                    Customer or a Caregiver, HLO will never give any of your data,
                    whether partially or fully to any third party. HLO reserves the
                    right to use transactional data for our own marketing. Please refer
                    to our Data Privacy Policy for more details.
                `
            ]
        }
    ]
});
