import axios from "axios";

async function createUser(itsc: string, name: string): Promise<any> {
  try {
    const { data } = await axios({
      method: 'post',
      headers: {
        'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
      },
      url: process.env.API_URL,
      data: {
        query: `
          mutation createUserIfNotExist($itsc:String!, $name:String!) {
            createUser(
              object:{
                itsc: $itsc
                name: $name
              }
            ){ id }
          }`,
        variables: { itsc, name }
      },
    });
    console.log(`[!] Created new user for itsc id: ${itsc}`)
    const { data: { createUser }} = data;
    return createUser.id;
  } catch (error) {
    throw error;
  }
}

export async function getUserData(itsc: string, name:string): Promise<any> {
  try {
    const { data: { data } } = await axios({
      method: 'post',
      headers: {
        'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
      },
      url: process.env.API_URL,
      data: {
        query: `
            query getUserData($itsc: String!) {
              users(where: {
                itsc: {
                  _eq: $itsc
                }
              }) {
                id
                hasTeachingRole
              }
              semesters(
                limit: 1
                order_by: {
                  createdAt: desc
                }
              ) {
                id
              }
            }`,
        variables: { itsc }
      },
    });
    let userId;
    if(data.users.length===0) {
      userId = await createUser(itsc, name);
    } else {
      userId = data.users[0].id;
    }
    const [semester] = data.semesters;
    return {
      userId,
      semesterId: semester.id
    };
  } catch (error) {
    throw error;
  }
}