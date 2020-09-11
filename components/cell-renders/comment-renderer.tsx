import React from 'react';

import ContentView from '../../components/content-view';

class CommentCellRenderer extends React.Component<any, any> {
  public getValue = () => {
    return this.state.value;
  };

  constructor(props) {
    super(props);

    this.state = { value: props.value };
  }

  handleChange = (value) => {
    this.setState({ value: JSON.parse(value) });
  };

  handleKeyPress = (event) => {
    event.stopPropagation();
  };

  render() {
    return (
      <div onKeyDown={this.handleKeyPress}>
        <ContentView
          value={this.state.value}
          onChange={this.handleChange}
          readOnly={!this.props.cellStartedEdit}
        />
      </div>
    );
  }
}

export default CommentCellRenderer;
