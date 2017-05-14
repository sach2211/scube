import React, { Component } from 'react';
import styles from './index.css';
import dummy from '../data.json'
import { parseString } from 'xml2js';
import request from 'superagent';



class S3Explorer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isErrored: false,
      fileData:[]
    }
  }

  componentDidMount() {
    var self = this;
    request
    .get('http://choprasachin.samplebucket1.s3.amazonaws.com/')
    .then(res => {
      parseString(res.text, function(error, result){
        if (error) {
          console.error('Failed in parsing the result');
          this.setState({
            isLoading: false,
            isErrored: true
          });
          return;
        }
        console.log('Successfully fetched the data ', result.ListBucketResult.Contents);
        self.setState({
            isLoading: false,
            isErrored: true,
            fileData: self.preprocessStateData(result.ListBucketResult.Contents)
          });
      })
    })
    .catch(err => {
      console.log('Error : In S3 Api fetch ', err);
    })
  }
  
  preprocessStateData(data) {
    // const fileHierarchy = {};
    const splitArr = data.map((thisData) => {
        return thisData.Key[0].split('/').slice(0, thisData.Key[0].split('/').length-1);
    })

    const fileHierarchy = {};
    splitArr.map((thisPath) => {
      var current = fileHierarchy;
      for (var i = 0; i < thisPath.length; i++) {
        if (!current[thisPath[i]]) {
          current[thisPath[i]] = {}
        } 
        current = current[thisPath[i]];
      }
    })
    console.log("File Paths", fileHierarchy);

    return splitArr;
  }

  render() {
    console.log('File Data', this.state.fileData);
    return (
      <div>
        <div>
          <h2>Your S3 Data</h2>
          {/*<FileTree fileData={this.state.fileData}/>*/}
        </div>
      </div>
    );
  }
}

const FileTree = (props) => {
  const { fileData } = props;
  console.log("In file tree", fileData);
  return (
    <div>
      {
        fileData.map((thisData) => (
          <div> {thisData.Key[0]} </div>
        ))
      }
    </div>
  );
}
FileTree.prototype = {
  fileData: React.PropTypes.array
}
export default S3Explorer;
