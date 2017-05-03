// 年和月的选择组件
import React,{
    Component
} from "react";

import DatePickerCore from "./core";

const datepicker = new DatePickerCore();

class DateSelectItem extends Component {

    constructor(state) {
        super(state)
        this.state = {}
    }

    componentWillMount() {
        let d = new Date();
        if (this.props.type == 'year') {
            let year = this.props.value;
            let min = new Date(this.props.min);
            this.setState({
                now: year+datepicker.lang[datepicker.data.lang].year,
                value: year,
                listKey: year,
                min: min.getFullYear()
            })
        } else {
            let month = parseInt(this.props.value);
            this.setState({
                now: datepicker.lang[datepicker.data.lang].months[month - 1],
                value: month,
                listKey: month,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            if (this.props.type == 'year') {
                let year = nextProps.value;
                let min = new Date(nextProps.min);
                this.setState({
                    now: year+datepicker.lang[datepicker.data.lang].year,
                    value: year,
                    listKey: year,
                    min: min.getFullYear()
                })
            } else {
                let month = parseInt(nextProps.value);
                this.setState({
                    now: datepicker.lang[datepicker.data.lang].months[month - 1],
                    value: month,
                    listKey: month,
                })
            }
        }
    }

    activeSelectMain() {
        this.setState({
            active: !this.state.active
        })
    }

    selectLeft() {
        if (this.state.value == 1) return this;
        let val = this.state.value - 1;
        let now;
        if (this.props.type == 'year') {
            now = val + datepicker.lang[datepicker.data.lang].year;
        } else {
            now = datepicker.lang[datepicker.data.lang].months[val - 1];
        }
        this.setState({
            value: val,
            listKey: val,
            now: now
        });
        this.props.selectHanlder(val);
    }

    selectRight() {
        if (this.state.value == 12 && this.props.type == 'month') return this;
        let val = this.state.value + 1;
        let now;
        if (this.props.type == 'year') {
            now = val + datepicker.lang[datepicker.data.lang].year;
        } else {
            now = datepicker.lang[datepicker.data.lang].months[val - 1];
        }
        this.setState({
            value: val,
            listKey: val,
            now: now
        });
        this.props.selectHanlder(val);
    }

    selectUp() {
        let val = this.state.listKey - 12;
        this.setState({
            listKey: val
        });
    }

    selectDown() {
        let val = this.state.listKey + 12;
        this.setState({
            listKey: val
        });
    }

    selectItem(e) {
        let val = e.target.getAttribute('data-value');
        val = parseInt(val);
        if (this.state.min && val < this.state.min) return this;
        let now;
        if (this.props.type == 'year') {
            now = val + datepicker.lang[datepicker.data.lang].year;
        } else {
            now = datepicker.lang[datepicker.data.lang].months[val - 1];
        }
        this.setState({
            value: val,
            now: now,
            active: false
        });
        this.props.selectHanlder(val);
    }

    render() {
        let _this = this;
        let selectUp = null;
        let selectDown = null;
        let className = "select-group";
        if (this.props.type == 'year') {
            className += " year-select";
            selectUp = (<span className="select-switch switch-up" onClick={this.selectUp.bind(this)}><span className="arrow"></span></span>)
            selectDown = (<span className="select-switch switch-down" onClick={this.selectDown.bind(this)}><span className="arrow"></span></span>)
        } else {
            className += " month-select";
        }

        let selectMainStyle = {
            'display': 'none'
        };
        if (this.state.active) {
            selectMainStyle = Object.assign({},selectMainStyle,{
                'display': 'flex'
            })
        }

        let selectList = [];
        if (this.props.type == 'year') {
            for (let i = this.state.listKey - 5; i < this.state.listKey + 7; i++) {
                selectList.push({
                    name: i+datepicker.lang[datepicker.data.lang].year,
                    value: i
                })
            }
        } else {
            for (let i = 1; i < 13; i++) {
                selectList.push({
                    name: datepicker.lang[datepicker.data.lang].months[i - 1],
                    value: i
                })
            }
        }

        return (
            <div className={className}>
                <span className="value" onClick={this.activeSelectMain.bind(this)}>
                    <span className="name">{this.state.now}</span>
                    <span className="arrow"></span>
                </span>
                <span className="switch-btn prev-btn" onClick={this.selectLeft.bind(this)}><span className="arrow"></span></span>
                <span className="switch-btn next-btn" onClick={this.selectRight.bind(this)}><span className="arrow"></span></span>

                <div className="select-main" style={selectMainStyle}>
                    {selectUp}
                    {selectList.map(function(item,index) {
                        let className = "select-item";
                        if (item.value == _this.state.value) {
                            className += " active";
                        } else if (_this.state.min && item.value < _this.state.min) {
                            className += " none";
                        }
                        return (<span key={index} data-value={item.value} className={className} onClick={_this.selectItem.bind(_this)}>{item.name}</span>)
                    })}
                    {selectDown}
                </div>
            </div>
        )
    }
}

export default DateSelectItem;
