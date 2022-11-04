import { APIData } from "../types/main";

// Generic post request client based on vanilla JS.
const sendPostRequest = async (uri: string, data: any): Promise<APIData> => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
      const response = await fetch(uri, options);
      const json = await response.json();
      return json;
  }

export default sendPostRequest;