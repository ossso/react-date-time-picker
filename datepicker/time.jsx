/**
 * 时间选择组件
 */
import React,{
    Component
} from "react";

import DatePickerCore from "./core";

const datepicker = new DatePickerCore();

class TimeSelect extends Component {
    constructor(state) {
        super(state)
        this.state = {}
    }

    activeSelectMain(e) {
        let type = e.target.getAttribute('data-type');
        this.setState({
            activeType: (type != this.state.activeType)?type:false,
            selectTitle: (type=='hours')?datepicker.lang[datepicker.data.lang].hours:datepicker.lang[datepicker.data.lang].minutes
        })
    }

    closeSelect() {
        this.setState({
            activeType: false
        })
    }

    selectItem(e) {
        let val = e.target.getAttribute('data-value');
        let type = this.state.activeType;
        type = type.toString();
        this.props.selectHanlder(val,type);
        this.setState({
            activeType: false
        })
    }

    render() {
        let _this = this;
        let list = [];
        let hours = datepicker.digit(this.props.hours);
        let minutes = datepicker.digit(this.props.minutes);
        if (this.state.activeType == 'hours') {
            for (let i = 0; i < 24; i++) {
                list.push({
                    name: datepicker.digit(i),
                    value: i
                })
            }
        } else if (this.state.activeType == 'minutes') {
            for (let i = 0; i < 60; i++) {
                list.push({
                    name: datepicker.digit(i),
                    value: i
                })
            }
        }

        let selectMainStyle = {
            'display': 'none'
        }
        let className = "value-select";
        if (this.state.activeType) {
            selectMainStyle = Object.assign({},selectMainStyle,{
                'display': 'flex'
            })
            className += ' '+this.state.activeType;
        }
        return (
            <div className="date-picker-time-group">
                <span className="name">时间</span>
                <span className="value-item time-hours" data-type="hours" onClick={this.activeSelectMain.bind(this)}>{hours}</span>
                <span className="time-fgf">:</span>
                <span className="value-item time-minutes" data-type="minutes" onClick={this.activeSelectMain.bind(this)}>{minutes}</span>
                <div className={className} style={selectMainStyle}>
                    <div className="title">
                        <span className="title-name">{this.state.selectTitle}</span>
                        <span className="close-btn" onClick={this.closeSelect.bind(this)} title={datepicker.lang[datepicker.data.lang].close}><span className="bf bf-close"></span></span>
                    </div>
                    {list.map(function(item,index) {
                        return (<span key={index} data-value={item.value} className="select-item" onClick={_this.selectItem.bind(_this)}>{item.name}</span>);
                    })}
                </div>
            </div>
        )
    }
}

export default TimeSelect;
