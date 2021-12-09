import React from 'react';
import { Link } from 'react-router-dom';
import { useParams, useHistory } from 'react-router';
import { Course, EditComponentProps, Technology } from '../Tools/data.model';
import { History } from "history";
import './Edit.scss';
import { sendJSONData } from '../Tools/Toolkit';

const Edit = ({type, technologies, reload, setLoading, courses}: EditComponentProps) => {

    const UPDATE_SCRIPT:string = type == "technology" ? "/tech/put" : "/course/put";

    // isolate the id route parameter
    let { id } = useParams<{id:string}>();

      // routing navigation
    const history:History = useHistory();

    let technology: (Technology | undefined) = type == "technology" ? technologies.find(item => item._id == id) : undefined;
    let course: (Course | undefined) = type == "course" ? courses.find(item => item._id == id) : undefined;

    // Disable submit button
    const [disableSubmit, setdisableSubmit] = React.useState<boolean>(true);

    // Display error message
    const [showError, setShowError] = React.useState<boolean>(false);

    // Recording user inputs
    const [name, setName] = React.useState<string>(technology == undefined ? "" : technology.name);
    const [description, setDescription] = React.useState<string>(technology == undefined ? "" : technology.description);
    const [difficulty, setDifficulty] = React.useState<number>(technology == undefined ? 1 : technology.difficulty);
    const [coursesSelected, setCoursesSelected] = React.useState<Course[]>(technology == undefined ? [] : technology.courses);
    const [nameInput, setNameInput] = React.useState<string>(course == undefined ? "" : course.name);

    function onNameInputChange(e: any) {
        setNameInput(e.target.value);
    }

    function onNameChange(e: any) {
        setName(e.target.value);
    }

    function onDescriptionChange(e: any) {
        setDescription(e.target.value);
    }

    function onDifficultyChange(e: any) {
        setDifficulty(Number.parseInt(e.target.value));
    }

    function onCourseSelect(e: any) {
        let selected: Course | undefined = courses.find(c => c.code == e.target.value);
        if(selected !== undefined) {
            if(e.target.checked) {
                coursesSelected.push({"code": selected.code, "name": selected.name});
                setCoursesSelected(Array.from(coursesSelected));
            } else {
                setCoursesSelected(coursesSelected.filter(c => c.code !== selected?.code));
            } 
        }
    }

    // Enable/disable submit button based on user input
    React.useEffect(() => {
        if((name != "" && description != "") || nameInput != "") {
            setdisableSubmit(false);
        } else {
            setdisableSubmit(true);
        }
    }, [name, description, nameInput]);

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

        if(type == "technology") {
            jsonData = {
                "id" : id,
                "name": name,
                "description": description,
                "courses": coursesSelected,
                "difficulty": difficulty
           };
        } else {
            jsonData = {
                "id"  : id,
                "code": course?.code,
                "name": nameInput
           };
        }
        sendJSONData(UPDATE_SCRIPT, "PUT", JSON.stringify(jsonData), onResponse, onError);
    }

    // ---------------------------------- render to the DOM
    return(

        (technology === undefined && course === undefined) ?

        <div className="content">
            <div className="content__name"><Link to={`/`} ><i className="fas fa-arrow-left content__button"></i></Link> Error :(</div><br/>
            <div className="content__description">The requested data does not exist in the database</div>
        </div>

        :

        <div className="userForm">
            {(type === "course") ? 

            <div>
                <div className="userForm__field">
                    <label className="userForm__label" htmlFor="code">Code (10 Characters):</label><br/>
                    <input className="userForm__input" type="text" name="name" id="name" maxLength={10} disabled value={course?.code}/>
                </div>
                <div className="userForm__field">
                    <label className="userForm__label" htmlFor="name">Name (50 Characters):</label><br/>
                    <input className="userForm__input" type="text" name="name" id="name" maxLength={50} required onChange={onNameInputChange} value={nameInput}/>
                </div>
            </div>

            :

            <div>
                <div className="userForm__field">
                    <label className="userForm__label" htmlFor="name">Name (20 Characters):</label><br/>
                    <input className="userForm__input" type="text" name="name" id="name" maxLength={20} required onChange={onNameChange} value={name}/>
                </div>
                <div className="userForm__field">
                    <label className="userForm__label" htmlFor="description">Description (500 Characters):</label><br/>
                    <textarea className="userForm__input" name="description" id="description" maxLength={500} required onChange={onDescriptionChange} value={description}></textarea>
                </div>
                <div className="userForm__field">
                    <label className="userForm__label" htmlFor="difficulty">Difficulty:</label><br/>
                    <select className="userForm__input" name="difficulty" id="difficulty" onChange={onDifficultyChange} defaultValue={difficulty} >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div className="userForm__field">
                    Used in courses: 
                    {courses.map((data: Course, n: number) => {
                        return (
                            <div className="" key={n}>
                                <input type="checkbox" name={data.code} id={data.code} onChange={onCourseSelect} value={data.code} checked = {coursesSelected.findIndex(c => c.code == data.code) != -1 ? true : false}/>
                                <label htmlFor={data.code}>{data.code} {data.name}</label>
                            </div>
                        )
                    })}
                    
                </div>
            </div>

            }

            <div className="userForm__error" style={{display: showError ? "block" : "none"}}>Error while updating technology!</div>
            <div>
                <button type="submit" className="menu__btn" 
                        style={{marginRight: "5px"}}
                        disabled={disableSubmit}
                        onClick={() => onSubmit()}>Ok</button>
                            
                <Link to={`/`} >
                    <button className="menu__btn">Cancel</button>
                </Link>
            </div>
        </div>

    );
}

export default Edit;