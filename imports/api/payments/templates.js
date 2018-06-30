export default function({ hours, rate, extra, customerEmails, jobTitle, caregiverName }) {
    let total = 0;
    if( extra ) total = ( hours * rate ) + extra;
    else total = hours * rate;
    const items = [{
        'name': 'Caregiver Hourly Charge',
        'quantity': hours,
        'unit_price': {
            'currency': 'HKD',
            'value': rate
        }
    }];
    if( extra ) items.push({
        'name': 'Extra Charges',
        'quantity': 1,
        'unit_price': {
            'currency': 'HKD',
            'value': extra
        }
    });

    return {
        'merchant_info': {
            'first_name': 'Richard',
            'last_name': 'Au',
            'business_name': 'HealthyLovedOnes'
        },
        'billing_info': [{
            'email': customerEmails[0].email
        }],
        'cc_info': customerEmails.slice(1),
        'items': items,
        'note': `
            Invoice for the payment to the caregiver ${caregiverName}
            for the job ${jobTitle}.
        `,
        'payment_term': {
            'term_type': 'DUE_ON_RECEIPT'
        },
        'tax_inclusive': false,
        'total_amount': {
            'currency': 'HKD',
            'value': `${total}`
        },
        'logo_url': 'https://hloapp.herokuapp.com/img/invoice-logo.jpg'
    }
};