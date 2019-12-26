import { request } from '../utils/ajax.js';
import { Chart } from '../utils/chart.js';

// 流动性溢价因子
const liquidityChart = new Chart(document.querySelector('#liquidityChart'));
liquidityChart.updateOptions({
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
    request(`http://101.200.206.6/api/get_liquidity_premium.php`)
        .then(res => {
            liquidityChart.update({
                title: {
                    text: '流动性溢价因子'
                },
                legend: {
                    data: ['未加权', '加权']
                },
                xAxis: {
                    data: res.map(item => item.date)
                },
                yAxis: {
                    name: ''
                },
                series: [{
                    name: '未加权',
                    data: res.map(item => item.liquidity_premium)
                }, {
                    name: '加权',
                    data: res.map(item => item.liquidity_premium_weighted)
                }]
            })
        })
}