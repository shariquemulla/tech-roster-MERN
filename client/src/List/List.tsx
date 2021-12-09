import React from 'react';
import { Link } from 'react-router-dom';
import './List.scss';
import { TechData, Course, Technology } from '../Tools/data.model';

const List = ({technologies, courses}: TechData) => {

    // ---------------------------------- render to the DOM
    return(
        <div className="content">
            <div className="content__section">
                <div className="content__caption">Technologies:</div>

                {/* <div> below to be rendered For each technology */}

                <div className="content__list">
                    <Link to={`tech/add`} ><i className="fas fa-plus"></i></Link>
                </div>

                {technologies.map((data: Technology, n: number) => { 
                    return (
                        <div key={n} className="content__list">
                            <Link style={{marginRight: "10px"}} to={`tech/edit/${data._id}`} ><i className="fas fa-pencil-alt"></i></Link>
                            <Link style={{marginRight: "10px"}} to={`tech/delete/${data._id}`} ><i className="fas fa-trash-alt"></i></Link>
                            <span>{data.name}</span>
                        </div>
                    )
                })}

            </div>
            <div className="content__section">
                <div className="content__caption">Courses:</div>

                {/* <div> below to be rendered For each course */}

                <div className="content__list">
                    <Link to={`course/add`} ><i className="fas fa-plus"></i></Link>
                </div>

                {courses.map((data: Course, n: number) => { 
                    return (
                        <div key={n} className="content__list">
                            <Link style={{marginRight: "10px"}} to={`course/edit/${data._id}`} ><i className="fas fa-pencil-alt"></i></Link>
                            <Link style={{marginRight: "10px"}} to={`course/delete/${data._id}`} ><i className="fas fa-trash-alt"></i></Link>
                            <span>{data.code} {data.name}</span>
                        </div>
                    )
                })}

            </div>
        </div>
    );
}

export default List;