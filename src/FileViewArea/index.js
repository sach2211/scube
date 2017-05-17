import React, { Component } from 'react';
import './index.css';
import request from 'superagent';

class FileViewArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: '',
      showFileContent: false
    };
  }

  componentWillReceiveProps (nextProps) {
    var self = this;
    if (nextProps.filePath) {
      request
      .get(nextProps.filePath)
      .end( (err, resp) => {
        if (!err) {
          console.log(" Thsi i not error", resp);
          self.setState({
            showFileContent: true
          });
        }
      });
    }
  }

  render() {
    let page = <div> Please select a file </div>
    if (this.state.showFileContent)
      page = <iframe className="file-iframe-wrapper" src={this.props.filePath} />
    return page;
  }
}

export default FileViewArea;