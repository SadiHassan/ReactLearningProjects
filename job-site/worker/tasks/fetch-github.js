var fetch = require('node-fetch');

const redis = require("redis");
const client = redis.createClient();

const { promisify } = require("util");
//const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const baseURL = 'https://jobs.github.com/positions.json';

async function fetchGithub(){

    let resultCount = 1, onPage = 0; //onPage is basically page_index
    const allJobs = []
    
    //fetch all pages
    while(resultCount > 0){
        //const res = await fetch(`${baseURL}?page=${onPage}&search=remote`); //for remote jobs only
        const res = await fetch(`${baseURL}?page=${onPage}`);
        const jobs = await res.json();
        
        allJobs.push(...jobs);
        resultCount = jobs.length;
        //jobs.map(job => console.log(job['company']))
        console.log("Found " + jobs.length + " jobs..");
        onPage++;
    }
    
    console.log("Total " + allJobs.length + " jobs found for you!!!")
    
    //filter algorithm
    const jrJobs = allJobs.filter(job => {
        const jobTitle = job.title.toLowerCase();
        
        if( /*jobTitle.includes('senior') ||
            jobTitle.includes('manager') ||
            jobTitle.includes('sr.') ||
            jobTitle.includes('architect')
            ||*/ !jobTitle.includes('remote')
        ) return false;
        return true;
    });

    console.log('Junior Jobs Total : ' + jrJobs.length);
    //set in redis
    const success = await setAsync('github', JSON.stringify(jrJobs))

    console.log(success);
}



//fetchGithub(); //required when we want to run the single JS file
module.exports = fetchGithub;