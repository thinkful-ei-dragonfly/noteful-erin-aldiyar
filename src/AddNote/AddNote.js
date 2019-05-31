import React from 'react';
import config from '../config';
import cuid from 'cuid';
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationError/ValidationError';


export default class AddFolder extends React.Component {
  static contextType = ApiContext;
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      content: '',
      folder: '',
      value: '',
      // nameValid: false,
      // validationMessages: {},
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(e.target.addNoteName.value, e.target.addNoteContent.value, e.target.addNoteFolder.value)
    const name = e.target.addNoteName.value;
    const content = e.target.addNoteContent.value;
    const currentDate = new Date();
    const folderId = e.target.addNoteFolder.value;
    console.log(currentDate);
    
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type' : 'application/json'
      },
      body: JSON.stringify({
        id: cuid(),
        name: name,
        modified: currentDate,
        folderId,
        content: content
      })
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
    this.setState({name}, () => {this.validateName(name)});
  }

  setContent = content => {
    this.setState({content})
    console.log(this.state.content)
  }

  setFolder = id => {
    this.setState({folder: id})
    console.log(this.state.folder)
  }

  // validateName(name) {
  //   const nameError = {...this.state.validationMessages}
  //   let hasError = false;

  //   if (name.length === 0) {
  //     nameError.name = 'Name is required';
  //     hasError = true;
  //   } else {
  //     nameError.name = '';
  //     hasError = false;
  //   }

  //   this.setState({
  //     validationMessages: nameError,
  //     nameValid: !hasError
  //   })
  // }

  render() {
    const mappedOptions = this.context.folders.map(folder => <option value={folder.id} key={folder.id} id={folder.id} name={folder.name}>{folder.name}</option>)
    return(
      <div className='AddNoteForm'>
        <form onSubmit={e =>{
           this.handleSubmit(e)
           this.props.history.push('/')}}>
          <label htmlFor='addNoteName'>Name of the Note:</label>
            <input id='addNoteName' type='text' name='addNoteName' className='addNoteName'></input>
            {/* <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>   */}
          <label htmlFor='addNoteContent'>Content:</label>
            <input id='addNoteContent' type='addNoteContent' name='addNoteContent' className='addNoteContent'></input>
          <label htmlFor='addNoteFolder'>Content:</label>
            <select id='addNoteFolder' name='addNoteFolder'>
              {mappedOptions}
            </select>
          <button type='submit'>Create Note</button>
        </form>
      </div>
    )
  }
}