import { ajax } from '../utils/ajax.js';
import { Chart } from '../utils/chart.js';

let timer, pending;
// 流动性溢价因子
const liquidityChart = new Chart(document.querySelector('#liquidityChart'));
liquidityChart.updateOptions({
    title: {
        text: '流动性溢价因子'
    },
    legend: {
        data: ['未加权', '加权']
    },
    yAxis: {
        name: ''
    },
    series: [{
        showSymbol: true,
        symbolSize: 6,
        hoverAnimation: true
    }, {
        showSymbol: true,
        symbolSize: 6,
        hoverAnimation: true
    }]
})

getYestodayLiquidityData();

function getYestodayLiquidityData() {
    if (pending) return
    pending = true;
    ajax('get', 'http://101.200.206.6/api/get_liquidity_premium.php')
        .pipe(retry(3), map(({ response }) => Array.isArray(response) ? response : []))
        .subscribe(res => {
            pending = false;
            liquidityChart.update({
                xAxis: {
                    data: res.map(item => item.date)
                },
                series: [{
                    name: '未加权',
                    data: res.map(item => item.liquidity_premium.toFixed(2))
                }, {
                    name: '加权',
                    data: res.map(item => item.liquidity_premium_weighted.toFixed(2))
                }]
            })
            timer = setTimeout(() => {
                getYestodayLiquidityData();
            }, 3000);
        })
}

document.querySelector('#destroyLiquidity').addEventListener('click', function () {
    liquidityChart.clear();
    clearTimeout(timer);
    getYestodayLiquidityData();
})