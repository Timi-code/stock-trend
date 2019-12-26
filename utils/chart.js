export class Chart {
    options = {
        title: {
            text: '量能变化图'
        },
        legend: {
            data: ['昨日', '今日']
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                const yestoday_data = params.filter(item => item.seriesId === 'yestoday')[0];
                const today_data = params.filter(item => item.seriesId === 'today')[0];
                const yestoday_icon = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${yestoday_color};"></span>`
                const today_icon = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${today_color};"></span>`
                const balance_icon = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color: purple;"></span>`
                let text = '';
                if (today_data && yestoday_data) {
                    text = today_icon + today_data.seriesName + ': ' + today_data.value + '<br />' + yestoday_icon + yestoday_data.seriesName + ': ' + yestoday_data.value + '<br />' + balance_icon + '差额：' + (today_data.value - yestoday_data.value) + '<br />' + yestoday_data.name;
                } else if (yestoday_data && !today_data) {
                    text = yestoday_icon + yestoday_data.seriesName + ': ' + yestoday_data.value + '<br />' + yestoday_data.name;
                } else if (!yestoday_data && today_data) {
                    text = today_icon + today_data.seriesName + ': ' + today_data.value + '<br />' + today_data.name;
                }
                return text;
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'category',
            splitLine: {
                show: false
            },
            boundaryGap: false,
            axisLabel: {
                interval: 20,
                // formatter: function (params) {
                //   const date = new Date(params);
                //   const texts = [date.getHours(), date.getMinutes(), date.getSeconds()]
                //   return moment(date).format('HH:mm');
                // }
            }
        },
        yAxis: {
            type: 'value',
            name: '金额（亿）',
            nameLocation: 'end',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            },
            max: function (value) {
                return Math.ceil(value.max * 1.2);
            }
        },
        series: [{
            name: '今日',
            id: 'today',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            itemStyle: {
                color: today_color
            },
            data: []
        }, {
            name: '昨日',
            id: 'yestoday',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            itemStyle: {
                color: yestoday_color
            },
            data: []
        }]
    };
    constructor(el, options = {}) {
        this.el = el;
        this.updateOptions(options);
        this.init();
    }

    init() {
        this.chart = echarts.init(this.el);
    }

    update(options) {
        this.updateOptions(options);
        this.chart.setOption(this.options);
    }

    updateOptions (options) {
        this.options = _.merge(this.options, options);
    }
}