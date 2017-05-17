import React, { Component } from 'react';
import './index.css';
import dummy from '../data.json'
import { parseString } from 'xml2js';
import request from 'superagent';
import rightArr from '../../right-full.png';
import downArr from '../../down-full.png';
import FileViewArea from '../FileViewArea';

class S3Explorer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isErrored: false,
      fileData:[],
      currentFilePath: '',
      showFileContent : false
    }
  }

  componentDidMount() {
    var self = this;
    request
    .get('http://choprasachin.samplebucket1.s3.amazonaws.com/')
    .then(res => {
      parseString(res.text, function(error, result){
        if (error) {
          // console.error('Failed in parsing the result');
          this.setState({
            isLoading: false,
            isErrored: true
          });
          return;
        }
        // console.log('Successfully fetched the data ', result.ListBucketResult.Contents);
        self.setState({
            isLoading: false,
            isErrored: true,
            rawData: result.ListBucketResult.Contents,
            fileData: self.preprocessStateData(result.ListBucketResult.Contents)
          });
      })
    })
    .catch(err => {
      // console.log('Error : In S3 Api fetch ', err);
    })
  }
  
  preprocessStateData(data) {
    // const fileHierarchy = {};
    const splitArr = data.map((thisData) => {
        let splitPath = thisData.Key[0].split('/');
        if (!splitPath[splitPath.length - 1])
          splitPath = splitPath.slice(0, splitPath.length-1);
        return splitPath;
    })

    const fileHierarchy = {};
    splitArr.map((thisPath) => {
      var current = fileHierarchy;
      for (var i = 0; i < thisPath.length; i++) {
        if (!current[thisPath[i]]) {
          current[thisPath[i]] = {}
        }
        current[thisPath[i]].view = 'collapsed';
        current = current[thisPath[i]];
      }
    })


    return fileHierarchy;
  }
  getCompletePath(key) {
    const data = this.state.rawData || [];
    const splitArr = data.map((thisData) => {
      let splitPath = thisData.Key[0].split('/');
      if (!splitPath[splitPath.length - 1])
        splitPath = splitPath.slice(0, splitPath.length-1);
      return splitPath;
    });

    const path = splitArr.find((thisPath) => {
      if (thisPath[thisPath.length - 1] === key)
        return true;
      return false;
    })
    

    const consolidatedPath =  path.reduce((acc, val) => {
      return acc + '/' + val;
    })

    return consolidatedPath;
  }
  loadCurrentFile(objectName) {

    let path = this.getCompletePath(objectName)
    var self = this;
    path = 'https://s3.amazonaws.com/choprasachin.samplebucket1/' + path;
      self.setState({
        currentFilePath: path
      });

  }

  toggleState(obj, key) {
    if (obj[key].view === 'collapsed'){
      obj[key].view = 'expanded';
    } else {
      obj[key].view = 'collapsed';
    }
  }

  searchAndUpdate(obj, key) {
    //Step: 1 => Push initital data
    let flag;

    if (!obj) {
      return
    }

    flag = Object.keys(obj).find((thisKey) => {
      return thisKey === key
    });
    if (flag) {
      this.toggleState(obj, key);
      return
    }

    Object.keys(obj).map((thisKey) => {
      if (typeof obj[thisKey] == 'object'){
        this.searchAndUpdate(obj[thisKey], key);
      }
    })
    
  }

  fileClickHandler(i, e) {
    e.stopPropagation();

    let updatedState = this.state.fileData;

    this.searchAndUpdate(updatedState, i);

    this.setState({fileData : updatedState, lastClick: i});

    this.loadCurrentFile(i);
  }

  render() {
    // console.log('File Data', this.state.fileData);
    return (
      <div>
        <div className='file-tree-wrapper'>
          <FileTree
            onFileClick={(i, e) => this.fileClickHandler(i, e)}
            fileData={this.state.fileData}/>
        </div>
        <div className='file-view-wrapper'>
          <FileViewArea filePath={this.state.currentFilePath}/>
        </div>
      </div>
    );
  }
}

const FileTree = (props) => {
  const { fileData, onFileClick } = props;

  if (fileData.view && fileData.view === 'collapsed') {
    return null;
  }
  return (
    <div className='file-tree-main'>
      {
        Object.keys(fileData).map((thisFile, index) => (
          (thisFile !== 'view')
          ?
            <div
              className="tree-branch"
              key={index+thisFile}
              onClick={(e) => onFileClick(thisFile, e)} > 
                <img src={fileData[thisFile].view == 'collapsed' ? rightArr : downArr} className="right-arrows" />
                {thisFile} 
              {
                fileData[thisFile] ? <FileTree fileData={fileData[thisFile]} onFileClick={onFileClick}/> : null
              }
            </div>
          : 
            null
        ))
      }
    </div>
  );
}

FileTree.prototype = {
  fileData: React.PropTypes.array
}

export default S3Explorer;
