/**
 * DatePicker 日期时间选择器核心JS
 * 所产生的callback 均为同步流程 暂无异步流程
 */
class DatePicker {
    constructor() {
        let d = new Date();
        this.data = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            date: d.getDate(),
            hours: d.getHours(),
            minutes: d.getMinutes(),
            seconds: d.getSeconds(),
            lang: 'zh_cn'
        };

        // 不确定时间规则
        this.ranges = {
            months: [31,false,31,30,31,30,31,31,30,31,30,31]
        }

        this.lang = {};
        // 多语言设置
        this.lang['zh_cn'] = {
            weeks: ['日', '一', '二', '三', '四', '五', '六'],
            months: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            year: '年',
            date: '日期',
            time: '时间',
            hours: '小时',
            minutes: '分钟',
            confirm: '确定',
            cancel: '取消',
            close: '关闭'
        };
    }

    init(options) {
        if (options.min) this.data.min = new Date(options.min);
        if (options.max) this.data.max = new Date(options.max);
        if (options.isTime) this.data.isTime = options.isTime;
        if (options.start) {
            this.data.start = new Date(options.start);
            let d = this.data.start;
            this.data = Object.assign({},this.data,{
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                date: d.getDate(),
                hours: d.getHours(),
                minutes: d.getMinutes(),
                seconds: d.getSeconds()
            })
        }
        return this;
    }

    // 是否闰年
    isleap(year) {
        return (year%4 === 0 && year%100 !== 0) || year%400 === 0;
    }

    // 双数补位
    digit(num) {
        return num < 10 ? '0' + (num|0) : num;
    }

    // 生成月份的日期数组
    createMonthDate(cb) {
        let year = parseInt(this.data.year),
            month = parseInt(this.data.month)
        // 将时间处理到该年该月的1号
        let d = new Date();
        d.setFullYear(year, month - 1, 1);

        // 得到当前月份日期总数
        let days = this.ranges.months[month - 1];
        if (!days) days = this.isleap(year)?29:28;

        // 将当前月份日期放入table
        let table = [];
        for (var i = 0; i < days; i++) {
            table.push({
                'year': year,
                'month': month,
                'date': i + 1
            });
        }

        // 判断第一周有几天是上个月的
        let first_week = d.getDay();
        if (first_week > 0) {
            let prev_month = month - 1;
            let prev_month_year = year;
            if (prev_month < 1) {
                prev_month = 12;
                prev_month_year = year - 1;
            }
            let prev_days = this.ranges.months[prev_month - 1];
            if (!prev_days) prev_days = this.isleap(year)?29:28;
            for (var i = 0; i < first_week; i++) {
                table.unshift({
                    'year': prev_month_year,
                    'month': prev_month,
                    'date': prev_days - i
                });
            }
        }

        // 判断最后一周有几天是下个月的
        // 为保证格式不出现变化，采用6*7 - length
        let last_days = 6*7 - table.length;
        let next_month = month + 1;
        let next_month_year = year;
        if (next_month > 12) {
            next_month = 1;
            next_month_year = year + 1;
        }
        for (var i = 1; i < last_days + 1; i++) {
            table.push({
                'year': next_month_year,
                'month': next_month,
                'date': i
            });
        }

        cb&&cb({
            table: table,
            days: days
        });

        return this;
    }

    // 创建小时
    createHours(cb) {
        var options = [];
        for (var i = 0; i < 24; i++) {
            options.push(this.digit(i));
        }
        cb&&cb({
            options: options
        })
        return this;
    }

    // 创建分钟
    createMinutes(cb) {
        var options = [];
        for (var i = 0; i < 60; i++) {
            options.push(this.digit(i));
        }
        cb&&cb({
            options: options
        })
        return this;
    }

    // 输出格式化时间
    format(d,isTime) {
        var str = "";
        var date = [];
        var time = [];
        date.push(d.getFullYear());
        date.push(this.digit(d.getMonth()+1));
        date.push(this.digit(d.getDate()));

        time.push(this.digit(d.getHours()));
        time.push(this.digit(d.getMinutes()));

        str = date.join("/");
        if (isTime) str += " "+time.join(":");
        return str;
    }

    // 判断日期选择是否有效
    handlerDateSelected(date,cb) {
        if (this.data.min) {
            var now = new Date(date);
            now = now.getTime();
            var min = this.data.min.getTime();
            if (now < min) {
                cb(false,'选择日期不能早于'+this.format(this.data.min));
                return this;
            }
        }
        if (this.data.max) {
            var now = new Date(date);
            now = now.getTime();
            var max = this.data.max.getTime();
            if (now > max) {
                cb(false,'选择日期不能晚于'+this.format(this.data.min));
                return this;
            }
        }
        cb(true);
        return this;
    }


}

export default DatePicker;
