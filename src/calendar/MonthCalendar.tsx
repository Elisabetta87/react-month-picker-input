import React, { Component } from 'react';

import OutsideClickWrapper from '../OutsideClickWrapper';

import Head from './Head';
import { MONTHS_NAMES, VIEW_MONTHS, VIEW_YEARS } from './constants';

export interface IProps {
  value?: null|Date,
  startYear?: number,
  onChange: (selectedYear: number, selectedMonth: number) => any,
  onOutsideClick: (e: any) => any,
}

export interface IState {
  years: Array<number>,
  selectedYear: null|number,
  selectedMonth: null|number,
  currentView: string,
}

class MonthCalendar extends Component<IProps, IState> {
  constructor(props: IProps){
    super(props);

    const { value } = this.props;

    const selectedYear = value ? value.getFullYear() : null;
    const selectedMonth = value ? value.getMonth() : null;

    const startYear = selectedYear || this.props.startYear || new Date().getFullYear() - 6;

    this.state = {
      years: Array.from({length: 12}, (v, k) => k + startYear),
      selectedYear,
      selectedMonth,
      currentView: selectedMonth ? VIEW_MONTHS : VIEW_YEARS,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;

    if (value && value !== this.props.value) {
      const selectedYear = value.getFullYear();
      const selectedMonth = value.getMonth();

      this.setState({
        selectedYear,
        selectedMonth,
        currentView: VIEW_MONTHS
      });
    }
  }

  onChange = (selectedYear, selectedMonth): void => {
    if (selectedYear !== null && selectedMonth !== null) {
      this.props.onChange(selectedYear, selectedMonth + 1);
    }
  }

  selectYear = (selectedYear: number): void => {
    this.setState({ selectedYear, currentView: VIEW_MONTHS });
    this.onChange(selectedYear, this.state.selectedMonth);
  };

  selectMonth = (selectedMonth: number): void => {
    this.setState({ selectedMonth });
    this.onChange(this.state.selectedYear, selectedMonth);
  };

  previous = (): void => {
    const startYear = this.state.years[0] - 12;
    this.updateYears(startYear);
  }

  next = (): void => {
    const startYear = this.state.years[11] + 1;
    this.updateYears(startYear);
  }

  updateYears = (startYear: number): void => {
    const years = Array.from({length: 12}, (v, k) => k + startYear);

    this.setState({ years, currentView: VIEW_YEARS });
  }

  isYears = (): boolean => {
    return this.state.currentView === VIEW_YEARS;
  }

  renderMonths = (): JSX.Element[] => {
    const { selectedMonth } = this.state;

    return MONTHS_NAMES.map((month, index) => {
      const selectedKlass = selectedMonth === index ? 'selected_cell' : '';

      return (
        <div
          key={index}
          onClick={()=>{this.selectMonth(index)}}
          className={`col_mp span_1_of_3_mp ${selectedKlass}`}
        >{month}</div>
      )
    });
  };

  renderYears = (): JSX.Element[] => {
    return this.state.years.map((year, i) => (
      <div
        key={i}
        onClick={()=>{this.selectYear(year)}}
        className="col_mp span_1_of_3_mp"
      >{year}</div>
    ));
  }

  render(): JSX.Element {
    const { selectedYear, selectedMonth } = this.state;

    return (
      <OutsideClickWrapper
        onOutsideClick={this.props.onOutsideClick}
        className="calendar-container"
      >
        <Head
          year={selectedYear}
          month={selectedMonth ? selectedMonth + 1 : null}
          onPrev={this.previous}
          onNext={this.next} />

        {this.isYears() ? this.renderYears() : this.renderMonths()}
      </OutsideClickWrapper>
    );
  }
};

export default MonthCalendar;