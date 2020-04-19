const axios = require('axios');
const {GraphQLObjectType, 
    GraphQLInt,GraphQLString, 
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema} = require('graphql');

//Launch Type
const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields: ()=> ({
        flight_number: {type: GraphQLInt},
        mission_name: {type: GraphQLString},
        launch_year: {type: GraphQLInt},
        launch_date_local: {type: GraphQLString},
        launch_success: {type: GraphQLBoolean},
        rocket: {type: RocketType}

    })
});

//Rocket Type
const RocketType = new GraphQLObjectType({
    name: 'Rocket',
    fields: ()=> ({
        rocket_id: {type: GraphQLString},
        rocket_name: {type: GraphQLString},
        rocket_type: {type: GraphQLString}

    })
});


//Rocket Type
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        // Get all launches
        launches:{
            type: GraphQLList(LaunchType),
            resolve(parent, args){
                return axios.get('https://api.spacexdata.com/v3/launches')
                    .then(res => res.data);
            }
        },
         // Get one launch
        launch:{
            type: LaunchType,
            args: {
                flight_number: {type: GraphQLInt}
            },
            resolve(parent, args){
                return axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
                    .then(res => res.data);
            }
        },
        // Get all rockets
        rockets:{
            type: GraphQLList(RocketType),
            resolve(parent, args){
                return axios.get('https://api.spacexdata.com/v3/rockets')
                    .then(res => res.data);
            }
        },
        // Get one rocket
        rocket:{
            type: RocketType,
            args: {
                rocket_id: {type: GraphQLString}
            },
            resolve(parent, args){
                return axios.get(`https://api.spacexdata.com/v3/rockets/${args.rocket_id}`)
                    .then(res => res.data);
            }
        }

    }
});

module.exports =new GraphQLSchema({
    query: RootQuery
});