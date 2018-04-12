import React from 'react'
import Dropzone from 'react-dropzone'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RemoveIcon from 'react-icons/lib/fa/close'

import './style.scss'

export default class Home extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      imageUrl: '',
      imagePreviewUrl: undefined,
      imageWidth: undefined,
      imageHeigth: undefined,
      draggingPosition: undefined,
      isDrawing: false,
      listPolygon: []
    }
  }

  onDrop(files) {
    let reader = new FileReader();
    let file = files[0];
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    }

    reader.onload = (theFile) => {
      let image = new Image();
      image.src = theFile.target.result;
      image.onload = () => {
        this.setState({
          imageWidth: image.width,
          imageHeigth: image.height
        })
      }
    }

    reader.readAsDataURL(file)
  }

  handleGetImageFromUrl(){
    let image = new Image();
    image.src = this.state.imageUrl
    image.onload = () => {
      this.setState({
        imageWidth: image.width,
        imageHeigth: image.height,
        imagePreviewUrl: this.state.imageUrl
      })
    }
  }

  handleUrlImageChanged(value){
    this.setState({
      imageUrl: value
    })
  }

  getImageContainer(){
    let output = (
      <div className="drop-file-container">
        <div className="dropzone">
          <Dropzone onDrop={(file) => this.onDrop(file)}>
            <p>Drop File Here</p>
          </Dropzone>
        </div>
        <div className="drop-file-text">OR</div>
        <div className="drop-file-input-container">
          <TextField
            hintText="Image URL"
            value={this.state.imageUrl}
            onChange={(e, value) => this.handleUrlImageChanged(value)}
          />
          <div>
            <RaisedButton
              label="Get Image"
              onClick={() => this.handleGetImageFromUrl()}
             />
          </div>
        </div>
      </div>
    )
    if(this.state.imagePreviewUrl){
      output = (
        <div className="image-stage-container">
          <div>
            <img src={this.state.imagePreviewUrl} width={this.state.imageWidth} height={this.state.imageHeigth}/>
            <svg
              className="svg-container"
              onMouseDown={(e) => this.addRectOnImage(e)}
              onMouseMove={(e) => this.handleMouseMove(e)}
            >
              {this.generatePolygon()}
            </svg>
          </div>
        </div>
      )
    }
    return output
  }

  stopDrawing(e){
    e.stopPropagation()
    this.setState({
      isDrawing: false,
      draggingPosition: undefined
    })
  }

  generateRectPoint(obj) {
    let listRect = obj.coordinates.map((objRect, rectIndex) => {
      const finishDrawing = rectIndex === 0
      return (
        <circle
          className="circle"
          key={rectIndex}
          r="4"
          cx={objRect.x}
          cy={objRect.y}
          onMouseDown={(e) => this.stopDrawing(e, finishDrawing)}
        />
      )
    })
    return listRect
  }

  generatePolygon(){
    let polygons = this.state.listPolygon.map((obj, index) => {
      const listRect = this.generateRectPoint(obj)
      const arrayPoint = obj.coordinates.map((objPolygon, polygonIndex) => {
        return `${objPolygon.x},${objPolygon.y}`
      })
      const points = arrayPoint.join(' ')
      const polygonClassName = this.state.isDrawing && index === this.state.listPolygon.length - 1 ? 'polygon drawing' : 'polygon'
      let coordinates = `${points}`
      if(this.state.draggingPosition !== undefined && index === this.state.listPolygon.length - 1){
        coordinates += ` ${this.state.draggingPosition}`
      }
      return (
        <g key={index}>
          <polygon className={polygonClassName} points={coordinates} />
          {listRect}
        </g>
      )
    })
    return polygons
  }

  addRectOnImage(e){
    if(this.state.isDrawing){
      const tempListPolygon = this.state.listPolygon
      let lastPolygon = tempListPolygon[tempListPolygon.length - 1]
      lastPolygon.coordinates.push({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})
      tempListPolygon[tempListPolygon.length - 1] = lastPolygon
      this.setState({
        listPolygon: tempListPolygon,
      })
    }
    else{
      const tempListPolygon = this.state.listPolygon
      tempListPolygon.push({
        coordinates: [{x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}]
      })
      this.setState({
        isDrawing: true,
        listPolygon: tempListPolygon
      })
    }
  }

  handleMouseMove(e){
    if(this.state.isDrawing){
      this.setState({
        draggingPosition: `${e.nativeEvent.offsetX},${e.nativeEvent.offsetY}`
      })
    }
  }

  handleRemoveListImageMap(removeIndex){
    const tempListPolygon = this.state.listPolygon.filter((objPolygon, index) => removeIndex !== index)
    this.setState({
      listPolygon: tempListPolygon
    })
  }

  getListImageMap(){
    let listMap = null
    if(this.state.listPolygon.length > 0){
      listMap = this.state.listPolygon.map((objPolygon, index) => {
        const arrayPoint = objPolygon.coordinates.map((objPolygon, polygonIndex) => {
          return `${objPolygon.x},${objPolygon.y}`
        })
        const coordinatesPoint = arrayPoint.join(' ')
        return (
          <TableRow key={index}>
            <TableRowColumn>
              {coordinatesPoint}
            </TableRowColumn>
            <TableRowColumn>
              <div className="list-image-map-remove-container">
                <span onClick={() => this.handleRemoveListImageMap(index)}><RemoveIcon /></span>
              </div>
            </TableRowColumn>
          </TableRow>
        )
      })
      listMap = (
        <div className="list-image-map-container">
          <Paper zDepth={3}>
            <Table className="table-list-image-map">
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn>Coordinates</TableHeaderColumn>
                  <TableHeaderColumn>Remove</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listMap}
              </TableBody>
            </Table>
          </Paper>
        </div>
      )
    }
    return listMap
  }

  render() {
    return (
      <div className="home-container">
        <div className="container">
          { this.getImageContainer() }
        </div>
        { this.getListImageMap() }
      </div>
    )
  }
}
