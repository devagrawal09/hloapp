import Datatypes from '../../../../api/data-types';
import TcData from '../../../../api/data-types/tc.js';

export const texts = {
    filters: {
        personal: {
            title: '個人護理',
            gender: {
                head: '性別',
                filters: [
                    { filter: 'Male', text: '男' },
                    { filter: 'Female', text: '女' }
                ]
            },
            religions: { head: '宗教', filters: [], other: '其他宗教' },
            languages: { head: '語言', filters: [], other: '其他語言' }
        },
        technical: {
            title: '所需技能',
            professional: { head: '專業服務', filters: [], other: '其他服務' },
            personal: { head: '個人護理', filters: [], other: '其他服務' },
            medical: { head: '曾經處理病情', filters: [], other: '其他情況' }
        },
        location: {
            title: '工作地區',
            locations: { head: '地點', filters: [], other: '其他地點' }
        },
        time: {
            title: '工作時間',
            time: { 
                head: '任期',
                filters: [
                    { filter: 'Short term', text: '短期（1小時至1週）' },
                    { filter: 'Long term', text: '長期（重複業務）' }
                ]
            }
        },
        price: {
            title: '價錢',
            head: '最高時薪'
        },
        btns: {
            reset: '重設',
            apply: '套用'
        },
        search: {
            placeholder: {
                job: '你在找什麼工作？',
                caregiver: '你在找誰？'
            }
        }
    },
    sortKeys: {
        name: '名稱',
        hourlyRate: '時薪',
        postedOn: '發佈日期',
        title: '職稱'
    },
    display: {
        grid: '網格', list: '列表'
    },
    head: '搜尋結果',
    more: '載入更多'
}

const fn = ( val, obj )=> ({ filter: val, text: obj[ val ] });

texts.filters.location.locations.filters = Datatypes.Location.allowedValues.map( ( val )=> fn( val, TcData.locations ));
texts.filters.personal.religions.filters = Datatypes.Religion.allowedValues.map( ( val )=> fn( val, TcData.religions ));
texts.filters.personal.languages.filters = Datatypes.Languages.allowedValues.map( ( val )=> fn( val, TcData.languages ));
texts.filters.technical.professional.filters = Datatypes.ProfessionalService.allowedValues.map( ( val )=> fn( val, TcData.professional ));
texts.filters.technical.personal.filters = Datatypes.PersonalService.allowedValues.map( ( val )=> fn( val, TcData.personal ));
texts.filters.technical.medical.filters = Datatypes.MedicalCondition.allowedValues.map( ( val )=> fn( val, TcData.medical ));
