import { Email } from 'meteor/email';

import { sendSMS } from '../../sms';

const root = process.env.ROOT_URL;

const emails = {
    welcome: 'welcome',
    pwdChange: 'password change',
    unameChange: 'username change',
    newMsg: 'new message'
}

const EmailNotifs = Object.keys( emails ).reduce( ( notifs, key )=> {
    notifs[key] = _.template( Assets.getText(`emails/${ emails[key] }.html`) );
    return notifs;
}, {});

Meteor.users.notifications = {
    welcome( user ) {
        const Urls =  {
            dashboard: `${ root }dashboard`
        }
        Email.send({
            from: 'info@healthylovedones.com',
            to: user.emails[0].address,
            replyTo: 'info@healthylovedones.com',
            subject: 'Welcome to HealthyLovedOnes',
            html: EmailNotifs.welcome({ user, Urls })
        });
    },
    newMobile( to ) {
        sendSMS({
            to, msg: 'Welcome, please complete your profile and job ads. If you need help please call 94606840. 歡迎，請完成填寫你的個人檔案及招聘廣告。如你有任何需要，請致電 94606840。'
        });
    },
    pwdChange( userId ) {
        const user = Meteor.users.findOne( userId );        
        const emails = user.getEmails();
        const Urls = {
            settings: ` ${ root }settings `,
        }
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `Password change alert`,
            html: EmailNotifs.pwdChange({ user, Urls })
        });
    },
    unameChange( userId ) {
        const user = Meteor.users.findOne( userId );        
        const emails = user.getEmails();
        const urls = {
            settings: ` ${ root }settings `,
        }
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `Username change alert`,
            html: EmailNotifs.unameChange({ urls })            
        });
    },
    newMsg( recipientId, senderId, msg ) {
        const recipient = Meteor.users.findOne( recipientId );
        const sender = Meteor.users.findOne( senderId );
        const emails = recipient.getEmails();
        Email.send({
            from: 'info@healthylovedones.com',
            to: emails,
            subject: `You have a new message`,
            html: EmailNotifs.newMsg({ recipient, sender, msg })
        });
    }
}