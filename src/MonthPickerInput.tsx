import React, { Component } from 'react';
import InputMask from 'react-input-mask';

const DATE_FORMAT = 'MM YYYY';

import MonthCalendar from './calendar';
import { valuesToMask, valuesFromMask } from './utils';

import './styles/index.css';

type OnChange = (maskedValue: string, year: number, month: number) => any;

export interface IProps {
  year?: number,
  month?: number,
  inputProps?: {
    name?: string,
    id?: string,
  },
  onChange?: OnChange,
};

export interface IState {
  year: void | number,
  month: void | number,
  inputValue: string,
  showCalendar: boolean,
};

class MonthPickerInput extends Component<IProps, IState> {
  wrapper: HTMLDivElement;
  input: { input: Element };

  public static defaultProps: Partial<IProps> = {
    inputProps: {}
  };

  constructor(props) {
    super(props);
    const { year, month } = this.props;
    let inputValue = '';
    if (typeof year == 'number' && typeof month == 'number') {
      inputValue = this.valToMask(month, year);
    }

    this.state = {
      year,
      month,
      inputValue,
      showCalendar: false
    }
  };

  valToMask = (month, year): string => {
    let monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[month]} ${year}`;
  }

  onCalendarChange = (year, month): void => {
    const inputValue = this.valToMask(month, year);
    this.setState({ inputValue, year, month });
    this.onChange(inputValue, year, month);
  };

  onInputChange = (e: { target: { value: string } }): void => {
    // const mask = e.target.value;

    // if (mask.length && mask.indexOf('_') === -1) {
    //   const [month, year] = valuesFromMask(mask);
    //   const inputValue = this.valToMask(month, year);
    //   this.setState({ year, month, inputValue });
    //   this.onChange(inputValue, year, month);
    // } else this.setState({ inputValue: mask });
  };

  onChange = (inputValue, year, month) => {
    if (this.props.onChange) {
      this.props.onChange(inputValue, year, month);
      if (this.state.year === year) {
        this.setState({ showCalendar: false });
      }
    }
  };

  onInputBlur = (e): void => {
    if (!this.wrapper.contains(e.target)) {
      this.setState({ showCalendar: false })
    }
  };

  onInputFocus = (e): void => {
    if (this.wrapper.contains(e.target)) {
      this.setState({ showCalendar: true });
    }
  };

  onCalendarOutsideClick = (e): void => {
    this.setState({ showCalendar: this.input.input == e.target });
  };

  calendar = (): JSX.Element => {
    const { year, month } = this.state;
    return (
      <div style={{ position: 'relative' }}>
        <MonthCalendar
          year={year}
          month={month}
          onChange={this.onCalendarChange}
          onOutsideClick={this.onCalendarOutsideClick}
        />
      </div>
    )
  };

  inputProps = (): object => {
    return Object.assign({}, {
      ref: input => { if (input) this.input = input; },
      mask: "**************",
      maskChar: ' ',
      type: 'text',
      onBlur: this.onInputBlur,
      onFocus: this.onInputFocus,
      onChange: this.onInputChange,
    }, this.props.inputProps)
  };

  render() {
    const { inputValue, showCalendar } = this.state;

    return (
      <div ref={wrap => { if (wrap) this.wrapper = wrap; }}>
        <InputMask
          value={inputValue}
          {...this.inputProps() }
        />

        {showCalendar && this.calendar()}
      </div>
    );
  };
};

export default MonthPickerInput;
