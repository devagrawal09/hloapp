import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';

import { messageSchema } from '../../../api/messages/schema.js';

import showAlert from '../alert';

import './compose-modal.html';

const texts = {
    en: {
        head: 'Compose Message',
        rec: {
            label: 'Recipient Username or Email',
            placeholder: 'Recipient'
        },
        sub: 'Subject',
        msg: {
            label: 'Message',
            placeholder: 'Write your message here...'
        },
        btns: {
            close: 'Close',
            send: 'Send'
        }
    },
    tc: {
        head: '撰寫信息',
        rec: {
            label: '收件人用戶名稱或電郵地址',
            placeholder: '收件人'
        },
        sub: '標題',
        msg: {
            label: '信息',
            placeholder: '在這裡寫下你的信息......'
        },
        btns: {
            close: '關閉',
            send: '發送'
        }
    }
}

Template.composeMsg.helpers({
    composeSchema: messageSchema.pick('recipient', 'subject', 'msg'),
    texts() {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            return texts.tc;
        return texts.en;
    }
});

AutoForm.hooks({
    newConversation: {
        after: { method( err, res ) {
            if( err ) {
                showAlert( err.reason, 'danger');
            } else {
                showAlert('Message sent successfully!');
                $('#compose').modal('hide');
            }
        }}
    }
});
