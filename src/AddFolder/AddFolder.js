import React from 'react';
import config from '../config';
import cuid from 'cuid';
import ApiContext from '../ApiContext';


export default class AddFolder extends React.Component {
  static contextType = ApiContext;
  constructor(props) {
    super(props);
    this.folderName = React.createRef();
    this.state = {
      name: ''
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const name = this.folderName.current.value;
    
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type' : 'application/json'
      },
      body: JSON.stringify(
        {name : name,
        id: cuid()})
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(res => {
        this.context.addFolder(res)
      })
      .catch(error => {
        console.error({ error })
      })


  }
  setName = name => {
    this.setState({name});
  }

  
  render() {
    return(
      <div className='AddFolderForm'>
        <form onSubmit={e =>{
           this.handleSubmit(e)
           this.props.history.push('/')}}>
          <label htmlFor='addFolder'>Name of the folder</label>
          <input onChange={e=> this.setName(e.target.value)} ref={this.folderName} id='addFolder' type='text' name='addFolder' className='addFolder'></input>
          <button type='submit'>Create folder</button>
        </form>
      </div>
    )
  }
}