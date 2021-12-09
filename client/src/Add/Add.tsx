import React from 'react';
import { Link, useHistory} from 'react-router-dom';
import { AddComponentProps, Course } from '../Tools/data.model';
import { sendJSONData } from '../Tools/Toolkit';
import { History } from "history";
import './Add.scss';

const Add = ({type, reload, setLoading, courses}: AddComponentProps) => {

    const INSERT_SCRIPT:string = type == "technology" ? "/tech/post" : "/course/post";

      // routing navigation
    const history:History = useHistory();

    // Disable submit button
    const [disableSubmit, setdisableSubmit] = React.useState<boolean>(true);

    // Display error message
    const [errorMessage, setErrorMessage] = React.useState<string>("Error while adding data!");
    const [showError, setShowError] = React.useState<boolean>(false);

    // Recording user inputs
    const [name, setName] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [difficulty, setDifficulty] = React.useState<number>(1);
    const [coursesSelected, setCoursesSelected] = React.useState<Course[]>([]);

    // Recording user inputs
    const [nameInput, setNameInput] = React.useState<string>("");
    const [codeInput, setCodeInput] = React.useState<string>("");

    function onNameInputChange(e: any) {
        setNameInput(e.target.value);
    }

    function onCodeInputChange(e: any) {
        setCodeInput(e.target.value);
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
            let selectedWithoutId = {"code": selected.code, "name": selected.name};
            if(e.target.checked) {
                coursesSelected.push(selectedWithoutId)
                setCoursesSelected(coursesSelected);
            } else {
                setCoursesSelected(coursesSelected.filter(c => c.code !== selected?.code));
            }
        }
    }

    // Enable/disable submit button based on user input
    React.useEffect(() => {
        if((name != "" && description != "") || (nameInput != "" && codeInput != "")) {
            setdisableSubmit(false);
        } else {
            setdisableSubmit(true);
        }
    }, [name, description, nameInput, nameInput, codeInput]);

    const onResponse = () => {
        reload();
        setShowError(false);
        history.push("/");
      };
    
    const onError = (message: string) => {
        console.log("*** Error has occured during AJAX data transmission: " + message);
        if(message != undefined) setErrorMessage(message);
        setShowError(true);
        setLoading(false);
    }

    function onSubmit() {
        setLoading(true);
        let jsonData = {};
        if (type == "technology") {
            jsonData = {
                "name": name,
                "description": description,
                "courses": coursesSelected,
                "difficulty": difficulty
            };
        } else {
            jsonData = {
                "code": codeInput,
                "name": nameInput
            };
        }
        
        sendJSONData(INSERT_SCRIPT, "POST", JSON.stringify(jsonData), onResponse, onError);
    }

    // ---------------------------------- render to the DOM
    return(
        <div className="userForm">
        {(type == "course") ?

        <div>
            <div className="userForm__field">
                <label className="userForm__label" htmlFor="code">Code (10 Characters):</label><br/>
                <input className="userForm__input" type="text" name="name" id="name" maxLength={10} required onChange={onCodeInputChange} value={codeInput}/>
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
                <select className="userForm__input" name="difficulty" id="difficulty" onChange={onDifficultyChange} defaultValue="1" >
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
                            <input type="checkbox" name={data.code} id={data.code} onChange={onCourseSelect} value={data.code}/>
                            <label htmlFor={data.code}>{data.code} {data.name}</label>
                        </div>
                    )
                })}
                
            </div>
        </div>

        }

        <div className="userForm__error" style={{display: showError ? "block" : "none"}}>{errorMessage}</div>
            <div>
                <button type="submit" className="menu__btn" 
                        style={{marginRight: "5px"}}
                        disabled={disableSubmit}
                        onClick={() => onSubmit()}>Ok</button>
                            
                <Link to={`/`} ><button className="menu__btn">Cancel</button></Link>
            </div>
        </div>
    );
}

export default Add;