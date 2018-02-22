import React, { Component } from 'react';
import logo from './logo.svg';
import merge from 'merge-images';
import './App.css';

import peronizador from './peronizador.png'

const baseSize = 512;

class App extends Component {

  constructor() {
    super();
    this.imageSelected = this.imageSelected.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.state = {images: [], images_formated: [], peron: []};

    this.reader = new FileReader();
  }

  imageSelected(e) {
    const file = e.target.files[0];
    this.reader.readAsDataURL(file);
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
      prev.peron = [peronify];
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
    return (
      <div className="App">
        <p className="App-intro">
        <input type="file" onChange={ this.imageSelected } /> <br />
        { this.state.images.map((image, i) => <img alt='' style={{display: 'none'}} onLoad={ this.onImageLoad } src={image} key={i} />) }
        { this.state.images_formated.map((image, i) => <img alt='' style={{display: 'none'}} src={image} key={i} />) }

        { this.state.peron.map((image, i) => <img alt="" src={image} key={i} />) }
        </p>
      </div>
    );
  }
}

export default App;
