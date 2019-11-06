import React from 'react';
import { StyleSheet, Text, View, StatusBar,TextInput ,Dimensions,Platform,ScrollView,AsyncStorage } from 'react-native';
import Loader from './Loader';
import ToDo from './ToDo'
import {AppLoading} from 'expo'
import uuidv1 from 'uuid/v1'

const { width,height} = Dimensions.get("window")

export default class App extends React.Component {
  
  state = {
    newToDo:"",
    loadedToDos:false,
    isLoading:true,
    toDos: {}
  }
  componentDidMount = () => {
    this._loadToDos();
    setTimeout(()=>{this.setState({isLoading:false})},2000)
  }
  render(){
    console.log(toDos)
    const {newToDo,isLoading,loadedToDos,toDos} = this.state
    if(!loadedToDos){
      return <AppLoading /> 
    }
    return (
      <>
        {
          isLoading? 
          <Loader/>  :
          (
            <View style={styles.container}>
              <StatusBar barStyle="dark-content" />
              <Text style={styles.title}>RYAN To Do</Text>
              <View style={styles.card}>
                <TextInput style={styles.input} placeholder={"New To Do"} value={newToDo} onChangeText={this._crontollNewToDo} placeholderTextColor={"#999"} returnKeyType={"done"}
                  autoCorrect={false} onSubmitEditing={this._addToDo}/>
                <ScrollView contentContainerStyle={styles.toDos}>
                  {Object.values(toDos).map(toDo => (
                  <ToDo key={toDo.id} deleteToDo={this._deleteToDo} completeToDo={this._completeToDo} uncompleteToDo={this._uncompleteToDo} updateToDo={this._updateToDo} {...toDo}/>
                  ))}
                </ScrollView>
              </View>
            </View>
          )
        }
      </>
    );
  }
  _crontollNewToDo = text => {
    this.setState({
      newToDo: text
    })
  }
  _loadToDos = () => {
    this.setState({
      loadedToDos: true
    })
  }
  _addToDo = () => {
    const {newToDo} = this.state;
    if(newToDo !== ""){
      // this.setState({
      //   newToDo:""
      // });
      this.setState(prevState => {
        const ID = uuidv1()
        const newToDoObject = {
          [ID] : {
            id : ID,
            isCompleted:false,
            text: newToDo ,
            createdAt: Date.now()
          }
        }
        const newState = {
          ...prevState,
          newToDo : "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        this._saveToDos(newState.toDos)
        return { ...newState };
      });
    }
  };
  _deleteToDo = id => {
    this.setState(prevState=>{
      const toDos = prevState.toDos 
      delete toDos[id]
      const newState = {
        ...prevState,
        ...toDos
      }
      this._saveToDos(newState.toDos)
      return {...newState}
    })
  }
  _uncompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted:false
          }
        }
      };
      this._saveToDos(newState.toDos)
      return {...newState}
    });
  };
  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {...prevState.toDos[id],isCompleted:true}
        }
      }
      this._saveToDos(newState.toDos)
      return {...newState}
    })
  }
  _updateToDo = (id,text) => {
    this.setState(prevState => { 
      const newState = {
        ...prevState,
        toDos : {
          ...prevState.toDos,
          [id]: {...prevState.toDos[id],text:text}
        }
      };
      this._saveToDos(newState.toDos)
      return { ...newState}
    })
  }
  _saveToDos = newToDos => {
    // console.log()
    const saveToDos = AsyncStorage.setItem("toDos",JSON.stringify(newToDos))
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6cd61',
    alignItems: 'center',
  },
  title:{
    fontSize:30,
    marginTop:50,
    fontWeight:"200",
    marginBottom:20,
  },
  card:{
    backgroundColor:"white",
    flex:1,
    width: width - 25,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    // shadow... to ios
    // elevation... to android
    // platform 마다 다르게 설정가능
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50,50,50)',
        shadowOpacity : 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height:-1,
          width: 0
        },
      },
      android:{
        elevation: 3
      }
    })

  },
  input:{
    padding:20,
    borderBottomColor:"#bbb",
    borderBottomWidth: 1,
    fontSize:25
  },
  toDos:{
    alignItems:"center",
  }
});
