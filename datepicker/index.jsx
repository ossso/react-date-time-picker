/**
 * 日期时间选择器组件
 * 引用参考
 * <DatePicker min={min} start={start} isTime={isTime} confirm={this.dateChange.bind(this)} cancel={this.closeDate.bind(this)} />
 */
import React,{
    Component
} from "react";

import "./style.scss";

import DatePickerCore from "./core";

const datepicker = new DatePickerCore();

import DateSelectItem from "./select";
import DateItem from "./date-item";
import TimeSelect from "./time";

class DatePicker extends Component {
    constructor(state) {
        super(state)
        this.state = {
            min: this.props.min || '1900/01/01',
            max: this.props.max,
            start: this.props.start,
            isTime: this.props.isTime
        }
    }

    componentWillMount() {
        var data = {}, _this = this;
        datepicker.init({
            min: this.state.min,
            max:  this.state.max,
            start: this.state.start,
            isTime: this.state.isTime
        }).createMonthDate(function(info) {
            data = Object.assign({},data,{
                month: info
            });
        }).createHours(function(info) {
            data = Object.assign({},data,{
                hours: info
            });
        }).createMinutes(function(info) {
            data = Object.assign({},data,{
                minutes: info
            });
        });
        this.setState({
            data: data,
            year: datepicker.data.year,
            month: datepicker.data.month,
            date: datepicker.data.date,
            hours: datepicker.data.hours,
            minutes: datepicker.data.minutes,
            datetime: datepicker.data.year+''+datepicker.data.month+''+datepicker.data.date,
            weeks_list: datepicker.lang[datepicker.data.lang].weeks
        });
    }

    selectDate(item) {
        let status = false;
        if (item.year != this.state.year) {
            datepicker.data.year = item.year;
            status = true;
        }
        if (item.month != this.state.month) {
            datepicker.data.month = item.month;
            status = true;
        }
        if (status) {
            var data = this.state.data;
            datepicker.createMonthDate(function(info) {
                data = Object.assign({},data,{
                    month: info
                });
            });
            this.setState({
                data: data
            })
        }
        this.setState({
            date: item.date,
            month: item.month,
            year: item.year,
            datetime: item.year+''+item.month+''+item.date
        });
    }

    selectYear(val) {
        let data = this.state.data;
        datepicker.data.year = val;
        datepicker.createMonthDate(function(info) {
            data = Object.assign({},data,{
                month: info
            });
        });
        this.setState({
            data: data,
            year: val
        });
    }

    selectMonth(val) {
        let data = this.state.data;
        datepicker.data.month = val;
        datepicker.createMonthDate(function(info) {
            data = Object.assign({},data,{
                month: info
            });
        });
        this.setState({
            data: data,
            month: val
        });
    }

    selectTime(val,type) {
        let obj = {};
        obj[type] = val;
        this.setState(obj);
    }

    // 确定按钮
    // 传出 日期、时间、毫秒数
    confirm() {
        let date = [];
        date.push(datepicker.digit(this.state.year));
        date.push(datepicker.digit(this.state.month));
        date.push(datepicker.digit(this.state.date));

        let time = [];
        time.push(datepicker.digit(this.state.hours));
        time.push(datepicker.digit(this.state.minutes));

        let d = new Date(date.join('/')+' '+time.join(':'));
        this.props.confirm(date,time,d.getTime());
    }

    // 取消按钮
    cancel() {
        this.props.cancel();
    }

    render() {
        if (this.props.hidden) return null;
        let _this = this;
        let date = '';
        let date_table = this.state.data.month.table;

        // 日历表格
        if (date_table && date_table.length) {
            let week_num = date_table.length/7;
            let week_list = [];
            for (var i = 0; i < week_num; i++) {
                week_list.push(date_table.slice(i*7,i*7+7));
            }
            let status = false;
            let status2 = false;
            date = (
                <tbody>
                    {week_list.map(function(item,index) {
                        return (<tr key={index}>
                            {item.map(function(item,index) {
                                if (item.date == 1 && !status2) {
                                    status = true;
                                    status2 = true;
                                }
                                let className = '';
                                if (!status) className = 'not-now-month';
                                let datetime = item.year+''+item.month+''+item.date;
                                if (datetime == _this.state.datetime) className = 'now-date';

                                if (item.date == _this.state.data.month.days) {
                                    status = false;
                                }
                                return (<DateItem key={index} className={className} selectDate={_this.selectDate.bind(_this)} item={item} index={index} />)
                            })}
                        </tr>)
                    })}
                </tbody>
            )
        }

        // 时间选择器
        let timeSelect = null;
        if (this.props.isTime) {
            timeSelect = (<TimeSelect hours={this.state.hours} minutes={this.state.minutes} selectHanlder={this.selectTime.bind(this)} />)
        }

        return (
            <div className="date-picker-group">
                <div className="date-picker-year-month">
                    <DateSelectItem type="year" min={this.state.min} value={this.state.year} selectHanlder={this.selectYear.bind(this)} />
                    <DateSelectItem type="month" value={this.state.month} selectHanlder={this.selectMonth.bind(this)} />
                </div>
                <table>
                    <thead>
                        <tr>
                            {this.state.weeks_list.map(function(item,index) {
                                return (<th key={index}>{item}</th>)
                            })}
                        </tr>
                    </thead>
                    {date}
                </table>
                {timeSelect}
                <div className="options-group">
                    <span className="option-btn confirm-btn" onClick={this.confirm.bind(this)}>{datepicker.lang[datepicker.data.lang].confirm}</span>
                    <span className="option-btn cancel-btn" onClick={this.cancel.bind(this)}>{datepicker.lang[datepicker.data.lang].cancel}</span>
                </div>
            </div>
        )
    }
}







export default DatePicker;
