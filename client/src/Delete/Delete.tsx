import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';
import { Course, DeleteComponentProps, Technology } from '../Tools/data.model';
import { History } from "history";
import './Delete.scss';
import { sendJSONData } from '../Tools/Toolkit';

const Delete = ({type, technologies, courses, setLoading, reload}: DeleteComponentProps) => {

    // isolate the id route parameter
    let { id } = useParams<{id:string}>();

    const INSERT_SCRIPT:string = type == "technology" ? "/tech/delete" : "/course/delete";

    // routing navigation
    const history:History = useHistory();

    let technology: (Technology | undefined) = type == "technology" ? technologies.find(item => item._id == id) : undefined;
    let course: (Course | undefined) = type == "course" ? courses.find(item => item._id == id) : undefined;

    // Display error message
    const [showError, setShowError] = React.useState<boolean>(false);

    const onResponse = () => {
        reload();
        setShowError(false);
        history.push("/");
      };
    
    const onError = (message: string) => {
        console.log("*** Error has occured during AJAX data transmission: " + message);
        setShowError(true);
        setLoading(false);
    }

    function onSubmit() {
        setLoading(true);
        let jsonData = {};
        if (type === "technology") {
            jsonData = { "id"  : id };
        } else {
            jsonData = { 
                "id"  : id ,
                "code" : course?.code,
                "name" : course?.name
           };
        }
        
        sendJSONData(INSERT_SCRIPT, "DELETE", JSON.stringify(jsonData), onResponse, onError);
    }

    // ---------------------------------- render to the DOM
    return(

        (technology === undefined && course === undefined) ?

        <div className="deleteContent">
            <div className="deleteContent__name"><Link to={`/`} ><i className="fas fa-arrow-left"></i></Link> Error :(</div><br/>
            <div className="deleteContent__description">The requested data does not exist in the database</div>
        </div>

        :

        <div className="deleteContent">
            
            {(type === "course") ?

            <div>
                <div className="deleteContent__name">Are you sure you want to delete the following course?</div>
                <div className="deleteContent__name">{course?.code} {course?.name}</div>
            </div>

            :

            <div>
                <div className="deleteContent__name">Are you sure you want to delete the following technology?</div>
                <div className="deleteContent__name">{technology?.name}</div>
            </div>

            }

            <div className="userForm__error" style={{display: showError ? "block" : "none"}}>Error while deleting data!</div>
            <div>
                <button type="submit" className="deleteContent__button" 
                        style={{marginRight: "5px"}}
                        onClick={() => onSubmit()}>Ok</button>
                            
                <Link to={`/`} ><button className="deleteContent__button">Cancel</button></Link>
            </div>
        </div>
    );
}

export default Delete;