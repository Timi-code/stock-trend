import { request } from '../utils/ajax.js';
import { Chart } from '../utils/chart.js';
import { transformData } from '../utils/util.js';

// 股票图
let stockTimer;
const stockChart = new Chart(document.querySelector('#stockChart'));
document.getElementById('stockCode').addEventListener('keypress', function (ev) {
    const code = this.value.trim();
    if (ev.keyCode === 13) {
        getYestodayStockData(code);
    }
})

// 昨日stock数据
function getYestodayStockData(code) {
    request(`http://101.200.206.6/api/get_security_tick_yestoday.php?code=${code}`)
        .then(res => {
            const yestoday_data = transformData(res, 10000);
            stockChart.updateOptions({
                xAxis: {
                    data: yestoday_data.map(item => item[0])
                },
                yAxis: {
                    name: '金额（万）'
                },
                series: [
                    {},
                    {
                        data: yestoday_data.map(item => item[1])
                    }
                ]
            })
            getTodayStockData(code);
        })
}

// 今日stock数据
function getTodayStockData(code) {
    request(`http://101.200.206.6/api/get_security_tick.php?code=${code}`)
        .then(res => {
            const today_data = transformData(res, 10000);
            stockChart.update({
                series: [{
                    data: today_data.map(item => item[1])
                }]
            })
            stockTimer = setTimeout(() => {
                getTodayStockData(code)
            }, 3000);
        })
}
