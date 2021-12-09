export interface TechData {
    technologies: Technology[];
    courses:     Course[];
}

export interface Technology {
    _id:         string;
    name:        string;
    description: string;
    difficulty:  number;
    courses:     Course[];
}

export interface Course {
    _id?:  string;
    code: string;
    name: string;
}

export interface AddComponentProps {
    type    : string,
    courses : Course[];
    reload  : Function;
    setLoading  : Function;
}


export interface EditComponentProps {
    type: string,
    technologies: Technology[];
    courses:    Course[];
    reload :    Function;
    setLoading: Function;
}


export interface DeleteComponentProps {
    type: string,
    technologies: Technology[],
    courses: Course[],
    reload: Function;
    setLoading: Function;
}