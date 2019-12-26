import { request } from '../utils/ajax.js';
import { Chart } from '../utils/chart.js';
import { transformData } from '../utils/util.js';

// 量能图
let code = 'zzlt';
let indexTimer, currentTimer;
let pending1, controller1, signal1;
let pending2, controller2, signal2;
const indexChart = new Chart(document.querySelector('#indexChart'));
document.querySelector('#indexCode').addEventListener('change', function (ev) {
    code = this.value;
    clearTimeout(indexTimer);
    clearTimeout(currentTimer);
    if (pending1) {
        controller1.abort();
        controller1 = new AbortController();
        signal1 = controller1.signal;
    }
    if (pending2) {
        controller2.abort();
        controller2 = new AbortController();
        signal2 = controller2.signal;
    }

    getYestodayData();
    getCurrentData();
})

controller1 = new AbortController();
signal1 = controller1.signal;
controller2 = new AbortController();
signal2 = controller2.signal;
getYestodayData();
getCurrentData();

// 昨日数据
function getYestodayData() {
    request(`http://101.200.206.6/api/get_index_tick_yestoday.php?code=${code}`)
        .then(res => {

            const yestoday_data = transformData(res, 100000000);
            indexChart.updateOptions({
                xAxis: {
                    data: yestoday_data.map(item => item[0])
                },
                series: [{
                    data: []
                }, {
                    data: yestoday_data.map(item => item[1])
                }]
            });

            getTodayData();
        })
}

// 今日数据
function getTodayData() {
    pending1 = true;
    request(`http://101.200.206.6/api/get_index_tick.php?code=${code}`, { signal: signal1 })
        .then(res => {
            const today_data = transformData(res, 100000000)
            indexChart.update({
                series: [{
                    data: today_data.map(item => item[1])
                }]
            })

            indexTimer = setTimeout(function () {
                getTodayData();
            }, 3000);
        })
        .finally(() => {
            pending1 = false;
        })
}

// 实时数据
function getCurrentData() {
    pending2 = true;
    request(`http://101.200.206.6/api/get_current_money_compare.php?code=${code}`, { signal: signal2 })
        .then(res => {
            document.querySelector('#yestodayMoney').innerHTML = `${Math.ceil(res.yestoday_data.money / 100000000)}亿元`;
            document.querySelector('#todayMoney').innerHTML = `${Math.ceil(res.today_data.money / 100000000)}亿元`;
            currentTimer = setTimeout(function () {
                getCurrentData();
            }, 3000);
        })
        .finally(() => {
            pending2 = false;
        })
}