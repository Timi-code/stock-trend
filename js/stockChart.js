import { ajax } from '../utils/ajax.js';
import { Chart } from '../utils/chart.js';
import { transformData } from '../utils/util.js';

let code, timer;
const yestodayDataSubject$ = new Subject();
const todayDataSubject$ = new Subject();
// 股票图
const stockChart = new Chart(document.querySelector('#stockChart'));

const yestodayData = yestodayDataSubject$.pipe(
    switchMap(() => ajax('get', 'http://101.200.206.6/api/get_security_tick_yestoday.php', { code: code })),
    map(({ response }) => {
        if (Array.isArray(response)) {
            return transformData(response, 10000);
        }
        return [];
    })
)
const todayData = todayDataSubject$.pipe(
    switchMap(() => ajax('get', 'http://101.200.206.6/api/get_security_tick.php', { code: code })),
    map(({ response }) => {
        if (Array.isArray(response)) {
            return transformData(response, 10000);
        }
        return [];
    })
)

yestodayData.subscribe(res => {
    stockChart.updateOptions({
        xAxis: {
            data: res.map(item => item[0])
        },
        yAxis: {
            name: '金额（万）'
        },
        series: [
            {},
            {
                data: res.map(item => item[1])
            }
        ]
    })
    todayDataSubject$.next();
})

todayData.subscribe(res => {
    stockChart.update({
        series: [{
            data: res.map(item => item[1])
        }]
    });
    timer = setTimeout(() => {
        todayDataSubject$.next();
    }, 3000);
})

document.getElementById('stockCode').addEventListener('keypress', function (ev) {
    stockChart.clear();
    code = this.value.trim();
    if (ev.keyCode === 13) {
        clearTimeout(timer)
        yestodayDataSubject$.next();
    }
})
