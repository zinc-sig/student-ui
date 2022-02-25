import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function (req:  NextApiRequest, res: NextApiResponse) { 
  try {
    console.log("inside API")
    const { topic } = req.query;
    console.log("body content")
    console.log(JSON.parse(req.body))

    const response = await axios({
      method: 'post',
      url: `http://webhook/trigger/notifications/subscribe/${topic}`,
      data: JSON.parse(req.body)
    });
    console.log(response)
    res.json({
      status: 'success'
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
}

export const config = {
  api: {
    externalResolver: true
  }
}