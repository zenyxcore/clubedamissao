export type SeasonStep = {title:string;token:string;task:string;options:string[];answer:string;hint:string;print:string;location:string;next:string};
export type SeasonMission = {id:string;title:string;intro:string;steps:SeasonStep[]};
