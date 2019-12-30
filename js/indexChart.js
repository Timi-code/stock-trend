import { ajax } from '../utils/ajax.js';
import { Chart } from '../utils/chart.js';
import { transformData } from '../utils/util.js';

const yestodayDataSubject$ = new Subject();
const todayDataSubject$ = new Subject();
const currentDataSubject$ = new Subject();

// 量能图
let code = 'zzlt';
const indexChart = new Chart(document.querySelector('#indexChart'));
document.querySelector('#indexCode').addEventListener('change', function (ev) {
    indexChart.clear();
    code = this.value;
    todayDataSubject$.next();
    yestodayDataSubject$.next();
    currentDataSubject$.next();
})

const yestodayData = yestodayDataSubject$.pipe(
    switchMap(() => ajax('get', 'http://101.200.206.6/api/get_index_tick_yestoday.php', { code: code })),
    map(({ response }) => Array.isArray(response) ? response : []),
    retry(3)
)
const todayData = todayDataSubject$.pipe(
    switchMap(() => ajax('get', 'http://101.200.206.6/api/get_index_tick.php', { code: code })),
    map(({ response }) => Array.isArray(response) ? response : []),
    retry(3)
)
const currentData = currentDataSubject$.pipe(
    switchMap(() => ajax('get', 'http://101.200.206.6/api/get_current_money_compare.php', { code: code })),
    map(({ response }) => response),
    retry(3)
)

yestodayData.subscribe(res => {
    const yestoday_data = transformData(res, 100000000);
    indexChart.update({
        xAxis: {
            data: yestoday_data.map(item => item[0].slice(0, 5))
        },
        series: [{

        }, {
            data: yestoday_data.map(item => item[1])
        }]
    });
})
todayData.subscribe(res => {
    const today_data = transformData(res, 100000000);
    indexChart.update({
        series: [{
            data: today_data.map(item => item[1])
        }]
    });
    setTimeout(() => {
        todayDataSubject$.next();
    }, 3000);
})
currentData.subscribe(res => {
    document.querySelector('#yestodayMoney').innerHTML = `${Math.ceil(res.yestoday_data.money / 100000000)}亿元`;
    document.querySelector('#todayMoney').innerHTML = `${Math.ceil(res.today_data.money / 100000000)}亿元`;
    setTimeout(() => {
        currentDataSubject$.next();
    }, 3000);
})

yestodayDataSubject$.next();
todayDataSubject$.next();
currentDataSubject$.next();

document.querySelector('#destroyIndex').addEventListener('click', function () {
    indexChart.clear();
    yestodayDataSubject$.next();
})
