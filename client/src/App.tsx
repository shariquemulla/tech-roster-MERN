import React from 'react';
import {Route, Switch} from "react-router-dom";
import './App.scss';
import "./../node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss";
import "./../node_modules/@fortawesome/fontawesome-free/scss/solid.scss";

import { getJSONData } from "./Tools/Toolkit";
import { Course, TechData, Technology } from "./Tools/data.model";

import Error from "./Error/Error";
import LoadingOverlay from "./LoadingOverlay/LoadingOverlay";

import List from './List/List';
import Add from './Add/Add';
import Edit from './Edit/Edit';
import Delete from './Delete/Delete';

const RETRIEVE_SCRIPT:string = "/get";

function App() {

  // ---------------------------------------------- event handlers
  const onResponse = (result:TechData):void => {
    setTechnologies(result.technologies);
    setCourses(result.courses);
    setLoading(false);
  };

  const onError = ():void => console.log("*** Error has occured during AJAX data transmission");

  // ---------------------------------------------- lifecycle hooks
  React.useEffect(() => {
    loadData();
  }, []);

  // load photos after adding a comment
  function loadData() {
    getJSONData(RETRIEVE_SCRIPT, onResponse, onError);
  }

  // --------------------------------------------- state setup
  const [technologies, setTechnologies] = React.useState<Technology[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true); 

  return (
    <div className="main">
      <LoadingOverlay bgColor="#a72f57" spinnerColor="#FFFFFF" enabled={loading} />

      <div className="header">_Technology Roster: Course Admin</div>

      {technologies.length > 0 ?
        <Switch>
          <Route
            path="/"
            render={() => <List technologies={technologies} courses={courses} />}
            exact />

          <Route
            path="/list"
            render={() => <List technologies={technologies} courses={courses}/>}
            exact />

          <Route
            path="/tech/add"
            render={() => <Add type="technology" courses={courses} reload={loadData} setLoading={setLoading} />}
            exact />
          
          <Route
            path="/course/add"
            render={() => <Add type="course" courses={[]} reload={loadData} setLoading={setLoading} />}
            exact />

          <Route
            path="/tech/edit/:id"
            render={() => <Edit type="technology" technologies={technologies} courses={courses} setLoading={setLoading} reload={loadData} />}
            exact />

          <Route
            path="/course/edit/:id"
            render={() => <Edit type="course" technologies={[]} courses={courses} setLoading={setLoading} reload={loadData} />}
            exact />

          <Route
            path="/tech/delete/:id"
            render={() => <Delete type="technology" technologies={technologies} courses={[]} setLoading={setLoading} reload={loadData} />}
            exact />
            
          <Route
            path="/course/delete/:id"
            render={() => <Delete type="course" technologies={[]} courses={courses} setLoading={setLoading} reload={loadData} />}
            exact />          

          <Route render={() => <Error />} />
        </Switch>

        : 
        <div>No technologies found!</div>
      }

      <div className="footer">Technology descriptions by <a href="https://wikipedia.com" target="_blank" rel="noopener noreferrer">MERN Stack</a></div>
    </div>
  );
}

export default App;
