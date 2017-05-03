/**
 * 日期单格
 */
import React,{
    Component
} from "react";

// 日期单格
class DateItem extends Component {
    selectDate() {
        this.props.selectDate(this.props.item);
    }
    render() {
        return (
            <td className={this.props.className} onClick={this.selectDate.bind(this)}>{this.props.item.date}</td>
        )
    }
}

export default DateItem;
