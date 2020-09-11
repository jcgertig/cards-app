import { Select } from 'antd';
import React, { Component } from 'react';

export default class SelectEditor extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  getValue = () => {
    return this.state.value;
  };

  handleChange = (value) => {
    this.setState({ value });
  };

  render() {
    return (
      <Select
        style={{ width: '100%' }}
        defaultValue={this.state.value}
        onChange={this.handleChange}
      >
        {this.props.options.map(({ value, label }) => (
          <Select.Option value={value} key={value}>
            {label}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
