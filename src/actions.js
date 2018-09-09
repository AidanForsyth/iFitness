/**
 * Description of the action goes here
 * @param  {String} params.name=value Description of the parameter goes here
 * @param  {Number} [params.age] Optional parameter
 */

// init knex
var knex = require('knex')({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './.data/db.sqlite'
  }
});

const axios = require('axios');

//global current time setup
var d = new Date();
let time = d.toLocaleTimeString('en-US');
let current_date = d.toISOString();

//global vars
let createReminder_q = false;
var reminderNAME = '';
var userRemindersls = [];
let userReminder_text = '';
var temp_str = []; //temporay strings

// NOT WORKING -- DON'T USE
async function DEBUG_NLU(state, event) {
  console.log(event.nlu.intents[1]);
  return {... state}
}

async function reminderCHECK(state, event) {
  // Check if user input has the word 'reminder' **Igonring case sensitivity

  //Regular Expression --- Use to catch any user input 
  //that contains the word 'reminder' in it
  var regex_check = new RegExp('(reminder)', 'i');

  //check user inputs matches with regex_check(to check if )
  console.log(event.text);
  console.log(regex_check.test(event.text));

  let pass = regex_check.test(event.text);

  if (pass == true) {
    createReminder_q = true;

    console.log('@@@@@@@before@@@@@@@');
    const stateId = event.sessionId || event.user.id;
    await event.bp.dialogEngine.endFlow(stateId);
    await event.bp.dialogEngine.jumpTo(stateId, 'Reminders.flow.json', 'entry', {resetState: true});
    await event.bp.dialogEngine.processMessage(stateId, event);
  }
  else {console.log("ERROR")}

  return {... state}
}

//Does work, having trouble where to exacute function --  SO if possible find a way to make it work
//So that when reminder is sent, they're A) sent to reminder B) resume their coversation
//NOTE: I'm not sure if it is necassary as it seems botpress sends the message after the conversation
//Or dosen't affect much of the flow  
async function checkForReee(state, event) {
  // Init var to check for schedule has been schedule
  var SP_check = await knex('Schedule_Passed').distinct('value').where({id: '1'}).pluck('value')
  console.log("####",SP_check[0]);

  for (let i = 0; i <= 3; i += 1){
    //Does 3 checks for  
    while (SP_check[0] != 1) {
        SP_check = await knex('Schedule_Passed').distinct('value').where({id: '1'}).pluck('value')
        if (SP_check[0] == 1) {
          //Switches to reminder flow
          console.log("####CHANGED")
          const stateId = event.user.id;
          await event.bp.dialogEngine.endFlow(stateId);
          await event.bp.dialogEngine.jumpTo(stateId, 'Reminders.flow.json', 'display', {resetState: true});
          await event.bp.dialogEngine.processMessage(stateId, event);
          SP_check[0] = 0;
        }
    }
  }
  let switch_QQ = SP_check[0];
  return {... state, switch: switch_QQ}
}

async function PLACEHOLDER(state, event) {
  const stateId = `${event.user.id}`;
  const current_node = await event.bp.dialogEngine.getCurrentPosition(stateId);
  const state_n = await event.bp.dialogEngine.stateManager.getState(stateId);
  const p = await event.bp.dialogEngine.stateManager.setState(stateId,state_n);
  await knex('Schedule_Passed').distinct('value').where({id: 2}).update({value: `${event}`})
  console.log(state_n);
  return {... state}
}
async function CreateUserReminderForMessage(state, event) {
  var regex_m_check = [];
  regex_m_check[0] = new RegExp();
  return {... state}
}
//global var
 ////// FEATURE NOT IMPLEMETED YET ////// VVVVVV

/*init reminder flag to make sure the bot goes into
 the 'Reminders' Flow, then create reminder using scheduler
 Which configures the params regarding the message and time
 */

  async function temp(state, event) {
    // /*text*/ -- delete the slashs and astricks to un comment code

    /* goes into database and looks at the 'user' table and checks 
    ** for the current user chatting to the bot
    ** using event.user.userId to check the table
    ** Then grabs it and console logs
    */
    const userIds = await knex('users').distinct('userId').where({userID: `${event.user.userId}`}).pluck('userId', 'first_name', 'last_name');
    console.log("@@@@@@@USERIDS@@@@@@@", userIds);

    await knex('Schedule_Passed').distinct('value').where({id: 3}).update({value: `${event}`})

    const local_user_id = event.user.userId;
    console.log("@@@@@@@Local_user_id@@@@@@@",local_user_id);

    d = new Date();

    time = d.toLocaleTimeString('en-US');
    console.log("@@@@@@@Current Time@@@@@@@", time);
    return {... state}
  }
  
  //get info from db
  async function readDatabase(state, event, params) {
    //To specify which data is being read from sql database

    //should be lowercase   USE db browser to check for names and details
    params.table;
    //Paramater of the table 
    params.coloum;
    //id = row
    params.id;

    //If parameters are not set then set to a blank string 
    if (params.table == null) {
      params.table = '';
    }
    if (params.coloum == null) {
      params.coloum = '';
    }
    if (params.id == null) {
      params.id = '';
    }

    //Check
    console.log("@@@@@@@TABLE@@@@@@@", params.table);
    console.log("@@@@@@@COLOUM@@@@@@@", params.coloum);
    console.log("@@@@@@@ROW@@@@@@@", params.id);

    //searching database
    knex(`${params.table}`).select(`${params.coloum}`).where('id', `${params.id}`).then(function(sch){
      //log database
      console.log("@@@@@@@DATABASE DATA@@@@@@@",sch);
    });

    //return variables **IF needed**
    return {... state}
  }
  
  //Not to be used in deloying the bot 
  async function createSchedule__FOR_DEVELOPER_USE_ONLY(state,event, params) {
    // all params should be string //

    //log sch params
    console.log("@@@@@@@NAME@@@@@@@", params.name);
    console.log("@@@@@@@TIME@@@@@@@", params.time);
    console.log("@@@@@@@TYPE@@@@@@@", params.type);

    //declare str from params.time
    let tim_zone_add = params.time;
    console.log("@@@@@@@TIME_ZONE@@@@@@@",tim_zone_add);
    console.log("@@@@@@@Type of var@@@@@@@",typeof tim_zone_add);
    //checking for hours in tim_zone_add
    console.log(tim_zone_add.charAt(11));
    console.log(tim_zone_add.charAt(12));
 
    //creating int to add to params.time
    let tim_change = tim_zone_add.substr(11,2);
    console.log(tim_change);
    tim_change = parseInt(tim_change);
    console.log("@@@@@@@ParseInt@@@@@@@",tim_change);
    console.log("@@@@@@@check@@@@@@@", typeof tim_change); //

    d = new Date();
    let time_offset = d.getTimezoneOffset();
    time_offset /= 60;
    tim_change += time_offset
 
    if (tim_change == 24) {tim_change = 0;}
    if (tim_change > 24) {
      let over_amount = tim_change - 24;
      tim_change = 0;
      tim_change += over_amount;
    }
    console.log("@@@@@@@NEW TIME CHANGE@@@@@@@", tim_change);
 
    if (tim_change > 10) {tim_change = tim_change.toString();}
    else if (tim_change < 10) {
      let temp_tim = tim_change
      tim_change = tim_change.toString();
      tim_change = tim_change.replace(tim_change,`0${temp_tim}`);
      console.log("@@@@@@@TEMP_TIM@@@@@@@", tim_change);
    }
 
    //Extracting the hours from the datetime format and creating
    //temporary varaibles to hold the date, minutes and seconds value
    let temp_date = params.time.substring(0,11);
    console.log("@@@@@@@temp date@@@@@@@@", temp_date);
     
    let temp_time_1 = params.time.substring(11,13);
    console.log("@@@@@@@temp time 1@@@@@@@", temp_time_1);
    let temp_time_2 = params.time.substring(13,24);
    console.log("@@@@@@@temp time 2@@@@@@@", temp_time_2);
 
    //Upating hour to UTC timezone/Greenwich, England  
    temp_time_1 = tim_change;
    console.log("@@@@@@@temp time 1 UPDATED@@@@@@@",temp_time_1);
 
    //Connecting the temporary date, minutes and second strings
    //with the updated hour string to recreate the ISO 8601 Timedate format
    params.time = temp_date.concat(temp_time_1,temp_time_2);
    console.log("@@@@@@@New DATE FORMAT@@@@@@@", params.time);

    //message user revcieves from the reminder
    let text = "Place Holder Text";

    await event.bp.scheduler.add({
      id: params.name,
      //time format == yyyy-mm-ddThh:mm:ss.ffffffZ
      schedule: params.time,
      action: 
      `const knex = await bp.db.get(); const stateId = '${event.user.id}'; const userIds = await knex('users').distinct('userId').where({userId: '${event.user.userId}'}).pluck('userId'); const text = '${text}'; return Promise.all(userIds.map(userId => bp.renderers.sendToUser(userId, '#builtin_text', {text, typing: true} )))`,
      enabled: true,
      //types: 'once', 'natural' and 'cron'
      schedule_type: params.type
    });
    //to track reminder time 
    reminderNAME = params.name;

    //required
    return {... state}
  }

  async function Finalized_createSchedule(state, event) {
    //final version of function meant to create the schedule without speficy developer input
    //get current date and time in ISO format
    const time_str = await knex('Schedule_Passed').distinct('value').where({id: 4}).pluck('value');
    const date_str = await knex('Schedule_Passed').distinct('value').where({id: 5}).pluck('value');
    let finalized_ISO_str = date_str + 'T' + time_str + ':00.000Z'
    console.log(finalized_ISO_str);

    //Grab text value
    const text = await knex('Schedule_Passed').distinct('value').where({id: 6}).pluck('value');

    let title = text + finalized_ISO_str;
    //create Schedule
    await event.bp.scheduler.add({
      id: title,
      //time format == yyyy-mm-ddThh:mm:ss.ffffffZ
      schedule: finalized_ISO_str,
      action: 
      `const knex = await bp.db.get(); const stateId = '${event.user.id}'; const userIds = await knex('users').distinct('userId').where({userId: '${event.user.userId}'}).pluck('userId'); const text = '${text}'; return Promise.all(userIds.map(userId => bp.renderers.sendToUser(userId, '#builtin_text', {text, typing: true} )))`,
      enabled: true,
      //types: 'once', 'natural' and 'cron'
      schedule_type: 'once'
    });
    return {... state}
  }
  
  // Get what user wants to be reminded of
  async function GetMessage(state, event) {
    let user_str = event.text;

    var regex = new RegExp(/(my)/gi);
    if (regex.test(user_str) == true) {
      user_str = user_str.replace(regex, 'your');
    }

    await knex('Schedule_Passed').distinct('value').where({id: 6}).update({value: `${user_str}`});

    return {... state}
  }

  // Gets the time the user wants to be reminded of
  async function GetReminderTime(state, event) {
    //Init regex and time input
    let time_str = event.text;
    var regex = []
    regex[0] = new RegExp(/(at)/i);
    regex[1] = new RegExp(/([0-9])|:|pm|am/gi);

    //gets rid of any excess text from the input string
    time_str = time_str.replace(regex[0], '');
    var time_raw = [];
    var time_ref = [];
    time_raw = time_str.match(regex[1]);
    console.log(time_raw);
    if (time_raw[1] == ':') {
      //IF the hour is one digit
      time_ref[0] = time_raw[0];
      time_ref[1] = time_raw[2].concat(time_raw[3]);
      time_ref[2] = time_raw[4];
    }
    else {
      //If the hour is two digits
      time_ref[0] = time_raw[0].concat(time_raw[1]);
      time_ref[1] = time_raw[3].concat(time_raw[4]);
      time_ref[2] = time_raw[5];
    }

    //check to verify that time_ref is working correctly
    console.log("#####", time_ref);
    let tim_change = parseInt(time_ref[0]);
    
    //get time Zone offset for UTC greenwich time format
    d = new Date();
    let time_offset = d.getTimezoneOffset();
    time_offset /= 60;

    tim_change += time_offset;

    if (tim_change == 24) {tim_change = 0;}
    if (tim_change > 24) {
      let over_amount = tim_change - 24;
      tim_change = 0;
      tim_change += over_amount;
    }

    //Applies the changes of hours
    if (time_ref[2] == 'pm') {
      if (time_ref[0] != '12') {
        tim_change += 12;
        console.log(tim_change);
        time_ref[0] = `${tim_change}`;
      }
    }
    else if (time_ref[2] == 'am') {
      if (time_ref[0] == '12') {
        time_ref[0] = '00'
      }
      if (tim_change < 10) {
        time_ref[0] = `0${tim_change}`;
      }
    }
    
    //create finalized version of time input
    console.log("@@@@@@@")
    let finalized_time = time_ref[0] + ':' + time_ref[1];

    //Uploads it to database (sqlite3)
    await knex('Schedule_Passed').where({id: 4}).update({value: `${finalized_time}`});
    return {... state}
  }

  //Gets the date the user wants to be remined on
  async function GetReminderDate(state, event) {
    //Init date input
    let date_string = event.text;
    date_string = date_string.replace(',', '');
    var date_list_raw = [];

    // Scans through the months
    var months = [/(January)/i, /(Febuary)/i, /(March)/i, /(April)/i, /(May)/i, /(June)/i, /(July)/i, /(Augest)/i, /(September)/i, /(October)/i, /(November)/i, /(December)/i ];
    for (let i = 0; i < 11; i += 1) {
      if (months[i].test(date_string) == true) {
          console.log("########", months[i]);
          date_list_raw[0] = date_string.match(months[i]);
          console.log(date_list_raw[0][0]);
      }
  }
  //Sets first array [0] to to the month
  date_list_raw[0] = date_list_raw[0][0];
  date_list_raw[0] = date_list_raw[0].toLocaleLowerCase();
  console.log(date_list_raw[0]);
  //Sets date_list_raw[1] to the number equivelent of the month
    switch(date_list_raw[0]) {
      case 'january': date_list_raw[1] = '01'; break;
      case 'febuary': date_list_raw[1] = '02'; break;
      case 'march': date_list_raw[1] = '03'; break;
      case 'april': date_list_raw[1] = '04'; break;
      case 'may': date_list_raw[1] = '05'; break;
      case 'june': date_list_raw[1] = '06'; break;
      case 'july': date_list_raw[1] = '07'; break;
      case 'augest': date_list_raw[1] = '08'; break;
      case 'september': date_list_raw[1] = '09'; break;
      case 'october': date_list_raw[1] = '10'; break;
      case 'November': date_list_raw[1] = '11'; break;
      case 'December': date_list_raw[1] = '12'; break;
  }

  date_string = date_string.toLowerCase();

  //Removes the month from string
  date_string = date_string.replace(date_list_raw[0], '')
  console.log(date_string);

  //inits the day and year from the date_string
  if (date_string.length == 7) {
    //If the day is one digit
    console.log("11111");
    date_list_raw[2] = `0${date_string.charAt(1)}`;
    date_list_raw[3] = date_string.substr(3,4);
  }
  else {
    //IF the day is two digits
    console.log("222222");
    date_list_raw[2] = date_string.substr(1,2);
    date_list_raw[3] = date_string.substr(4,4);
  }

  //Formats date
  console.log(date_list_raw);
  let finalized_date = date_list_raw[3] + '-' + date_list_raw[1] + '-' + date_list_raw[2];
  console.log(finalized_date);

  //Uploads Date
  await knex('Schedule_Passed').where({id: 5}).update({value: `${finalized_date}`});
    return {... state}
  }
  //time func
  function getTiME(state, event) {
    // time var
    var d = new Date();
    let time = d.toLocaleTimeString('en-US');
    //time check
    console.log(time);
    return {... state}
  }
  async function consoleLog(event, state) {

    return {... state}
  }

async function apiSetup(state, event){
  //after the authorization, the user is redirected and the code is stored in the url they are redirected to, so we ask the user to copy and paste the link into chat

  var url = event.text;
  //url = ""
  //console.log('@@@@event.text', url);
  //extract the authorization code from the url
  var code = url.substring(url.indexOf('=')+1, url.indexOf('#'));
  //console.log('@@@@code@@@@', code);
  //apparently fitbit uses single quotes when it should use double quotes
  //what we pass to axios
  var params = {
    //we need to post to the url to get an access token
    method: 'POST',
    url: 'https://api.fitbit.com/oauth2/token',
    //send across these headers and data for proper verification
    headers: {
      'Authorization': 'Basic MjJDWFRKOjgwYWJjYjM0OGQyMmY4YjdiYWJkODQyNzdhMzIyOTky',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: `client_id=22CXTJ&grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fflows%2Fmain&code=${code}`
  };
  //make the axios call
  var data = await axios(params)/*.then(function(ree){console.log('@@@@access_token@@@@', ree.data.access_token); console.log('@@@@refresh_token@@@@', ree.data.refresh_token);console.log('@@@@user_id@@@@', ree.data.user_id)})*/;
  //add the data we get to the database
  knex('fitbit_api').insert({id:event.user.id, userID:data.data.user_id, access_token:data.data.access_token, refresh_token:data.data.refresh_token}).then(function(done){console.log('done adding access tokens')});
  //knex('fitbit_api').insert([{userID:data.data.user_id}, {access_token:data.data.access_token}, {refresh_token:data.data.refresh_token}]).where('id', event.user.id).then(console.log("@@@@ done updating db @@@@"));
  console.log('@@@@data@@@@', data);
  return {...state}
}

async function fitbitGetSteps(state, event){
  //same as above
  var url = event.text;
  //console.log(window.location.href);
  //var API_KEY = url.split("#")[1].split("=")[1].split("&")[0];
  //var userId = url.split("#")[1].split("=")[2].split("&")[0];
  
  //get the access token and user id from the database
  var temp_token = await knex('fitbit_api').select('access_token').where('id', event.user.id);
  console.log("@@@@@@@@", temp_token[0].access_token);
  var access_token = temp_token[0].access_token;
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@", access_token);
  //var userId = await knex.select('userID').table('fitbit_api').where('id', event.user.id);
  //console.log('@@@@@@@@@@@id', userId[0].userID);

  //make the axios call and set headers
  var getURL = 'https://api.fitbit.com/1/user/-/activities/date/2018-07-30.json';
  let data = await axios.get(getURL, {headers: {"Authorization": 'Bearer ' + access_token}});
  
  //log the steps
  console.log("@@@@data@@@@", data);
  //var steps = data.data["activities-steps"][0].value;
  //console.log(data.data["activities-steps"][0].value);
  //console.log("@@@@data1@@@@", typeof data);
  //console.log(JSON.stringify(data.data[0]));
  return {...state}
}

  module.exports = {
    // List of Functions used in the bot //
    readDatabase, //line: 87
    getTiME, //line: 199
    createSchedule__FOR_DEVELOPER_USE_ONLY, //line: 123
    temp, //line: 67 
    reminderCHECK, //line: 33
    DEBUG_NLU, //line: 27
    checkForReee,
    PLACEHOLDER,
    log,
    set__state,
    consoleLog,
    GetReminderDate,
    GetReminderTime,
    Finalized_createSchedule,
    GetMessage,
    apiSetup,
    fitbitGetSteps
   }