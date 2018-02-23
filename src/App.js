import React, { Component } from 'react';
import logo from './logo.svg';
import merge from 'merge-images';
import './App.css';

import peronizador from './peronizador.png';
import peronAudio from './peron.mp3';

const baseSize = 512;

class App extends Component {

  constructor() {
    super();
    this.imageSelected = this.imageSelected.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onPeronLoad = this.onPeronLoad.bind(this);
    this.state = {images: [], images_formated: [], peron: null};

    this.reader = new FileReader();
  }

  imageSelected(e) {
    const file = e.target.files[0];
    this.reader.readAsDataURL(file);
  }

  onPeronLoad() {
    const audio = new Audio(peronAudio);
    audio.play();
    setTimeout(audio.stop, 3000);
  }

  async peronify() {
    if (this.state.images_formated.length !== 2) {return;}
    const peronify = await merge([
      {src: this.state.images_formated[0], x:0, y:0},
      {src: peronizador, x:0, y:baseSize},
      {src: this.state.images_formated[1], x:0, y:baseSize*2},
    ], {
      width: baseSize, height: baseSize*3
    });

    this.setState((prev) => {
      prev.peron = peronify;
      return prev;
    })
  }

  onImageLoad(e) {
    //if (this.state.images.length === 2) { return; }
    console.log('here')
    const img = e.target;

    const c = document.createElement('canvas');
    c.width = baseSize;
    c.height =baseSize;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, baseSize, baseSize);
    const base64String = c.toDataURL();

    this.setState((prev) => {
      prev.images_formated.push(base64String)
      this.peronify()
      return prev
    })

  }

  componentDidMount() {
    this.reader.addEventListener("load", () => {
      this.setState((prev) => {
        prev.images.push(this.reader.result);
        return prev;
      })
    }, false);  }

  render() {
    const progressWidth = (100 / 2) * this.state.images_formated.length;
    const instructionText = this.state.images_formated.length == 0 
      ? 'Elegir imagen antes de Peron'
      : 'Elegir imagen despues de Peron'

    if (this.state.peron) {
      return <div className="text-center">
        <a href={this.state.peron}>
          <img onLoad={ this.onPeronLoad } alt="peron" src={this.state.peron} />
        </a>
        </div>
    }

    return (
      <div className="container ev">
        <div className="row">
        { this.state.images.map((image, i) => <img alt='' style={{display: 'none'}} onLoad={ this.onImageLoad } src={image} key={i} />) }
        { this.state.images_formated.map((image, i) => <img alt='' style={{display: 'none'}} src={image} key={i} />) }

        <div className="col">
        <form>
          <div class="input-group mb-3">
          <div className="custom-file">
            <label className="custom-file-label">{instructionText}</label>
            <input className="custom-file-input" type="file" onChange={ this.imageSelected } />
          </div>
          </div>
        </form>
        </div>
        </div>
        <br />
        <div className="row">
          <div className="col">
            <div class="progress">
              <div class="progress-bar" role="progressbar" style={{width: progressWidth + '%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
	<div class="instrucciones">
	  <ul>
	    <li>Subí una imagen antes del rayo peronizador</li>
	    <li>Volve a subir otra imagen después del rayo peronificador</li>
	    <li>Disfruta del poder </li>
          </ul>
	</div>
      </div>
    );
  }
}

export default App;
